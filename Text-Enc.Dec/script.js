document.getElementById('encryptBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const encryptedText = await encrypt(inputText); 
    document.getElementById('outputText').value = encryptedText;
});

document.getElementById('decryptBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const decryptedText = await decrypt(inputText); 
    document.getElementById('outputText').value = decryptedText;
});

const IV_LENGTH = 16; // For AES, this is always 16
const LOCAL_STORAGE_KEY = 'secureEncryptionKey';
const MASTER_KEY = 'masterPassword1234'; // Replace this with a secure passphrase and never hard-code in production

// Helper function to convert array to hex string
function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to convert hex string to array
function hexToArrayBuffer(hex) {
    let bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return bytes.buffer;
}

// Encrypt data using a passphrase
async function encryptWithPassphrase(data, passphrase) {
    let passphraseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    let salt = crypto.getRandomValues(new Uint8Array(16));
    let keyMaterial = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        passphraseKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    let iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    let encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        keyMaterial,
        data
    );
    return { encryptedData, iv, salt };
}

// Decrypt data using a passphrase
async function decryptWithPassphrase(encryptedData, iv, salt, passphrase) {
    let passphraseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    let keyMaterial = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        passphraseKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    let decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        keyMaterial,
        encryptedData
    );
    return decryptedData;
}

// Store the encryption key securely in localStorage
async function storeEncryptionKey(key) {
    const { encryptedData, iv, salt } = await encryptWithPassphrase(key, MASTER_KEY);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        encryptedData: arrayBufferToHex(encryptedData),
        iv: arrayBufferToHex(iv),
        salt: arrayBufferToHex(salt)
    }));
}

// Retrieve the encryption key from localStorage
async function getEncryptionKey() {
    let storedKeyData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedKeyData) {
        const key = crypto.getRandomValues(new Uint8Array(32)); // Generate new key
        await storeEncryptionKey(key);
        return key;
    }
    storedKeyData = JSON.parse(storedKeyData);
    const encryptedData = hexToArrayBuffer(storedKeyData.encryptedData);
    const iv = hexToArrayBuffer(storedKeyData.iv);
    const salt = hexToArrayBuffer(storedKeyData.salt);
    const key = await decryptWithPassphrase(encryptedData, iv, salt, MASTER_KEY);
    return new Uint8Array(key);
}

async function encrypt(text) {
    const key = await getEncryptionKey();
    let iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    let cryptoKey = await crypto.subtle.importKey(
        'raw', 
        key, 
        { name: 'AES-CBC' }, 
        false, 
        ['encrypt']
    );
    let encodedText = new TextEncoder().encode(text);
    let encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encodedText
    );
    let ivHex = arrayBufferToHex(iv);
    let encryptedHex = arrayBufferToHex(new Uint8Array(encrypted));
    return ivHex + ':' + encryptedHex;
}

async function decrypt(text) {
    const key = await getEncryptionKey();
    let textParts = text.split(':');
    let iv = hexToArrayBuffer(textParts[0]);
    let encryptedText = hexToArrayBuffer(textParts[1]);
    let cryptoKey = await crypto.subtle.importKey(
        'raw', 
        key, 
        { name: 'AES-CBC' }, 
        false, 
        ['decrypt']
    );
    let decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encryptedText
    );
    return new TextDecoder().decode(decrypted);
}
