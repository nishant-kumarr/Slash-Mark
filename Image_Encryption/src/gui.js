const { ipcMain, dialog } = require('electron');
const path = require('path');
const encrypt = require('./encrypt');
const decrypt = require('./decrypt');

ipcMain.handle('encrypt', async (event, filePath, outputImageFileName, outputKeyFileName) => {
    await encrypt({ e: filePath, o: outputImageFileName, p: outputKeyFileName });
});

ipcMain.handle('decrypt', async (event, filePath, keyPath, outputImageFileName) => {
    await decrypt({ d: filePath, k: keyPath, o: outputImageFileName });
});

ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });
    return result.filePaths[0];
});

ipcMain.handle('save-file-dialog', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog({ defaultPath });
    return result.filePath;
});
