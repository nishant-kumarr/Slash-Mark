const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    encrypt: (filePath, outputImageFileName, outputKeyFileName) => ipcRenderer.invoke('encrypt', filePath, outputImageFileName, outputKeyFileName),
    decrypt: (filePath, keyPath, outputImageFileName) => ipcRenderer.invoke('decrypt', filePath, keyPath, outputImageFileName),
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    saveFileDialog: (defaultPath) => ipcRenderer.invoke('save-file-dialog', defaultPath)
});
