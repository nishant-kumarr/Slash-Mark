# Text Encryptor

## Overview
TextEncryptor is a web-based application designed for text encryption and decryption. It allows users to input text, encrypt it using AES encryption, and then decrypt it back to its original form. The encryption keys are securely stored using Web Crypto API and local storage.

## File Structure

Text Encryption-Decryption  
├── Background.png  
├── encryption.html   
├── style.css   
└── script.js   


## Files and Components

### 1) encryption.html
This is the main HTML file that structures the web page.
- **Components :**
  - `<div class="container">` : Contains the entire form structure.
  - `<h1>` : Header for the application.
  - Input section : Text input for user to enter the text to be encrypted/decrypted.
  - Button section : Buttons to trigger encryption and decryption.
  - Output section : Textarea to display the output.

### 2) style.css
This file contains the styling for the web page.
- **Components:**
  - `body` : Styles for the body including background image, font, and alignment.
  - `.container` : Styles for the main container, including background color, padding, border radius, and positioning.
  - `h1` : Styles for the header.
  - `label`, `input`, `textarea` : Styles for the input and output fields.
  - `button` : Styles for the buttons including hover effects.

### 3) script.js
This file contains the JavaScript code to handle the encryption and decryption logic.
- **Functions:**
  - **event listeners** : For the encrypt and decrypt buttons to trigger respective functions.
  - **encrypt()** : Encrypts the input text using AES-CBC encryption.
  - **decrypt()** : Decrypts the encrypted text back to its original form.
  - **getEncryptionKey()** : Retrieves the encryption key from local storage or generates a new one.
  - **storeEncryptionKey()** : Stores the encryption key securely in local storage.
  - **encryptWithPassphrase()** : Encrypts data using a passphrase.
  - **decryptWithPassphrase()** : Decrypts data using a passphrase.
  - **arrayBufferToHex()** : Converts an array buffer to a hex string.
  - **hexToArrayBuffer()** : Converts a hex string to an array buffer.

## Working Mechanism
1. User enters text in the input field.
2. Either user clicks on "Encrypt" to encrypt the text.
   - The text is passed to the `encrypt()` function.
   - An encryption key is retrieved or generated using `getEncryptionKey()`.
   - The text is encrypted using AES-CBC encryption and the result is displayed in the output field.
3. Or user clicks on "Decrypt" to decrypt the text.
   - The encrypted text is passed to the `decrypt()` function.
   - The text is decrypted using the same encryption key and AES-CBC decryption, and the original text is displayed in the output field.

## Tech used  
- **HTML** : Structure of the web page.
- **CSS** : Styling of the web page.
- **JavaScript** : Functionality of the application.
- **Web Crypto API** : For encryption and decryption operations.
- **Local Storage** : To store the encryption key securely.
- **AES-CBC** : Encryption method used for encrypting and decrypting text.

## How to Use
0. Get the code down
1. Open `encryption.html` in a web browser.
2. Enter the text you want to encrypt in the "Input text" field.
3. Click the "Encrypt" button to encrypt the text. The encrypted text will be displayed in the "Output Generated" field.
4. To decrypt the text, enter the encrypted text that you have to the "Input text" field.
5. Click the "Decrypt" button to decrypt the text. The original text will be displayed in the "Output Generated" field.

Ensure that your browser supports the Web Crypto API and local storage for the application to work correctly.

## Scope for further improvement 
- As our project is dependent on system for storage of key using browsers local storage, we can further improve it to store the key on some server or make the user input the key every time he/she decrypts. Thus, making it system idependent.


<div> 
<h2 align = 'right'> Thank You !! </h2>
</div>
