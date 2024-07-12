# Imcrypt-GUI

## Overview
Imcrypt-GUI is a user-friendly desktop application for encrypting and decrypting images. Built using Electron, it offers a graphical user interface (GUI) that simplifies the process of protecting image files with encryption keys.

## File Structure

Imcrypt - The image Encryptor  
│  
├── node_modules (Not pushed to GitHub, will be installed via npm)  
├── src  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── index.js ___ _( Main Electron application file )_   
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── encrypt.js ___ _( Encryption logic )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── decrypt.js  ___ _( Decryption logic )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── gui.js  ___ _( IPC handlers and GUI interactions )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── preload.js ___ _( Preload script for Electron )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── index.html  ___ _( HTML for the GUI )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    ├── style.css  ___ _( CSS styling for the GUI )_  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    └── background.png  ___ _( Background image for the GUI )_  
│  
├── package.json  ___ _( Project metadata and dependencies )_  
└── package-lock.json ___ _( Dependency tree and versions )_  




## Files and their functions

### src/index.js
The main Electron application file. It initializes the application, creates the main browser window, and loads the GUI from `index.html`.
- **createWindow** : Sets up the main browser window with specific dimensions and preload script.
- **app.on('ready')** : Creates the main window when the application is ready.
- **app.on('window-all-closed')** : Quits the application when all windows are closed (except on macOS).
- **app.on('activate')** : Recreates the window if the application is activated and no windows are open.

### src/encrypt.js
Contains the logic for encrypting images using the `jimp` library.
- **encrypt** : Main function that handles image encryption by XORing each pixel with a randomly generated key and saving the result.

### src/decrypt.js
Contains the logic for decrypting images using the `jimp` library.
- **decrypt** : Main function that reverses the encryption process by XORing each pixel with the provided key to restore the original image.

### src/gui.js
Handles IPC (Inter-Process Communication) between the frontend (HTML/JavaScript) and backend (Node.js/Electron).
- **ipcMain.handle('encrypt')** : Invokes the encryption function with provided file paths.
- **ipcMain.handle('decrypt')** : Invokes the decryption function with provided file paths.
- **ipcMain.handle('open-file-dialog')** : Opens a dialog to select a file and returns the selected file path.
- **ipcMain.handle('save-file-dialog')** : Opens a dialog to save a file and returns the chosen file path.

### src/preload.js
A preload script that exposes specific Node.js functionalities to the renderer process (frontend) using the Electron `contextBridge` and `ipcRenderer`.
- **contextBridge.exposeInMainWorld** : Exposes encryption, decryption, and file dialog methods to the frontend.

### src/index.html
The main HTML file for the GUI. It includes buttons for encryption and decryption and scripts to handle button clicks and interact with the backend.
- **Encrypt Button** : Opens file dialogs to select an image and save locations, then triggers the encryption process.
- **Decrypt Button** : Opens file dialogs to select an encrypted image and key file, then triggers the decryption process.

### src/style.css
- CSS file that defines the styling for the GUI, including fonts, button styles, and layout.

### src/background.png
- Background image for the GUI.

### package.json
- Contains project metadata, scripts, and dependencies. It specifies the packages required for running the application.

### package-lock.json
- Automatically generated file that records the exact version of each installed package.

## Working Mechanism
1. The user interacts with the GUI presented in `index.html`.
2. Upon clicking the "Encrypt" or "Decrypt" button, the frontend script invokes methods exposed via `preload.js`.
3. These methods send IPC messages to the main process (`gui.js`), which then calls the appropriate functions in `encrypt.js` or `decrypt.js`.
4. The encryption/decryption logic uses the `jimp` library to manipulate image data and either saves an encrypted image with a key or restores an original image from a key.

## Tools, Technologies, APIs, and Modules Used
- **HTML, CSS** : For the graphical user interface.
- **JavaScript** : Core programming language for both frontend and backend logic. In Frontend handles user interactions in `index.html` via script tags. In backend used to Implement the core encryption/decryption logic in `encrypt.js` and `decrypt.js`, and manages IPC communication in `gui.js`.
- **Electron** : Framework to create the desktop application.
- **Node.js** :  JavaScript runtime for backend operations.  
                - Module System : Organizes the application into separate modules (index.js, encrypt.js, decrypt.js, etc.).  
                - File System Operations : Reads and writes image and key files using the fs module.  
                - Package Management : Manages dependencies like jimp and cli-alerts.  
- **Jimp** : Image processing library.
- **cli-alerts** : For displaying alerts in the terminal. Informs if encryption successful or failed.

## Necessary Installation and Prerequisites
1. Ensure your system is set up for html, css, js and node.js
2. Get the code down and organised as per file structure
3. Install Dependencies : run command : `'npm install'`. This will install all required packages as specified in `package.json`. The `node_modules` directory will be created during this process.

## How to Use
1. **Start the Application** :
    ```bash
    npm start
    ```
    A electron `GUI` based application will open.
2. **Encrypt an Image**:
    - Click the "Encrypt" button in the GUI.
    - Select the image file to encrypt.
    - Choose the output file names for the encrypted image and the encryption key.
    - The application will encrypt the image and save the files.

3. **Decrypt an Image**:
    - Click the "Decrypt" button in the GUI.
    - Select the encrypted image file and the key file.
    - Choose the output file name for the decrypted image.
    - The application will decrypt the image and save the file.

By following these steps, you can securely encrypt and decrypt images using Imcrypt-GUI. Check `Demo Video` to see in action. 

<div>
  <h1 align = 'right'> Thank You !</h1>
</div>
