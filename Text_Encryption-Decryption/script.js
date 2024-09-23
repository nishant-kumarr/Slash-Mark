// Event listeners , waiting for button press 
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

//---------------------------------------------------------------------------------------

// Some variables declaration
const IV_LENGTH = 16; // For AES, this is always 16
const LOCAL_STORAGE_KEY = 'secureEncryptionKey';
const MASTER_KEY = 'masterPassword1234'; 
                                             // MASTER_KEY is not used directly for encryption. 
                                            // It serves as a passphrase to derive a secure encryption key 
                                            // using PBKDF2 before any actual data encryption occurs.

// Helper function to convert array to hex string
// Random intialisation vector generated as 8 bit int and is getting stored as hex generated as pair of 2 and 0 if masking needed.
function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper function to convert hex string to array
function hexToArrayBuffer(hex) {
    let bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return bytes.buffer;
}

//-----------------------------------------------------------------------------------------

// Encrypt data using a passphrase
async function encryptWithPassphrase(data, passphrase){     // Take data and master key
    let passphraseKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(passphrase),
        { name: 'PBKDF2' },         // formatting to PBKDF2 (Password-Based Key Derivation Function 2) so that it can be supported by
        false,                          // web crypto API
        ['deriveKey']
    );
    let salt = crypto.getRandomValues(new Uint8Array(16));      // Salting
    let keyMaterial = await crypto.subtle.deriveKey(        // Using master key to generate another encryption key from web crypto api.
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
    let iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));     // generating initialisation vector
    let encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        keyMaterial,                        // Encrypt data.
        data
    );
    return { encryptedData, iv, salt };     // Return the data.
}

// Decrypt data using a passphrase
async function decryptWithPassphrase(encryptedData, iv, salt, passphrase) {
    let passphraseKey = await crypto.subtle.importKey(      // Import data from local storage and web crypto.
        'raw',                                              // [Initialisaion vector][salt][enc. key]
        new TextEncoder().encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    let keyMaterial = await crypto.subtle.deriveKey(        // derive the encryption key
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
    let decryptedData = await crypto.subtle.decrypt(        // Decrypting the encrypted data.
        { name: 'AES-GCM', iv: iv },
        keyMaterial,
        encryptedData
    );
    return decryptedData;           // Return the encrypted data.
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
        const key = crypto.getRandomValues(new Uint8Array(32)); // Generate new key, if key not stored ever previously. i,e. first time
        await storeEncryptionKey(key);
        return key;
    }
    storedKeyData = JSON.parse(storedKeyData);
    const encryptedData = hexToArrayBuffer(storedKeyData.encryptedData);    // stored in hex format - convert to 8-bit array.
    const iv = hexToArrayBuffer(storedKeyData.iv);
    const salt = hexToArrayBuffer(storedKeyData.salt);
    const key = await decryptWithPassphrase(encryptedData, iv, salt, MASTER_KEY);
    return new Uint8Array(key);                             // Return that array generated oout of hex.
}

//--------------------------------------------------------------------------------------

async function encrypt(text) {
    const key = await getEncryptionKey();           // Get key 
    let iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));     // Get initialisation vector
    let cryptoKey = await crypto.subtle.importKey(         // Format the key to AES-CBC fomat to make compatible with web crypto api. 
        'raw', 
        key, 
        { name: 'AES-CBC' },        
        false, 
        ['encrypt']
    );
    let encodedText = new TextEncoder().encode(text);       // Encode the text.
    let encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },                        // Using Advance encryption standard - cypher block chaining.
        cryptoKey,
        encodedText
    );
    let ivHex = arrayBufferToHex(iv);           // converts vector to hexadecimal format.
    let encryptedHex = arrayBufferToHex(new Uint8Array(encrypted));     
    return ivHex + ':' + encryptedHex;      // returns concatenated vector and encrypted data with ':'
}

async function decrypt(text) {
    const key = await getEncryptionKey();       // Retrive encryption key.
    let textParts = text.split(':');            // split the array for datas.
    let iv = hexToArrayBuffer(textParts[0]);
    let encryptedText = hexToArrayBuffer(textParts[1]);
    let cryptoKey = await crypto.subtle.importKey(
        'raw',                                          // Format it to 'AES-CBC' for web crypto api support.
        key, 
        { name: 'AES-CBC' }, 
        false, 
        ['decrypt']
    );
    let decrypted = await crypto.subtle.decrypt(            // Decrypt it with the data.
        { name: 'AES-CBC', iv: iv },
        cryptoKey,
        encryptedText
    );
    return new TextDecoder().decode(decrypted);    // Return the data.
}
