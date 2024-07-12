const alert = require('cli-alerts');
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

const encrypt = async (flags) => {
    const filePath = flags.e;
    if (!filePath) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path'
        });
        throw new Error('Invalid file path');
    }

    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path'
        });
        throw new Error('Invalid file path');
    }

    try {
        const image = await jimp.read(fullPath);
        const extension = image.getExtension();
        const fileNameWithoutExtension = path.basename(fullPath, path.extname(fullPath));
        
        let outputImageFile = `${fileNameWithoutExtension}_encrypted.${extension}`;
        if (flags.o) {
            outputImageFile = path.resolve(flags.o);
        }
        
        if (fs.existsSync(outputImageFile)) {
            alert({
                type: 'error',
                name: 'Invalid output image file name',
                msg: `The output image file name already exists: ${outputImageFile}`
            });
            throw new Error('Invalid output image file name');
        }
        
        let outputKeyFile = `${fileNameWithoutExtension}_key.txt`;
        if (flags.p) {
            outputKeyFile = path.resolve(flags.p);
        }
        
        if (fs.existsSync(outputKeyFile)) {
            alert({
                type: 'error',
                name: 'Invalid output key file name',
                msg: `The output key file name already exists: ${outputKeyFile}`
            });
            throw new Error('Invalid output key file name');
        }
        
        const rgba = image.bitmap.data;
        const length = rgba.length;
        const key = [];
        for (let i = 0; i < length; i++) {
            key.push(Math.floor(Math.random() * 256));
        }
        
        for (let i = 0; i < length; i++) {
            const k = key[i];
            rgba[i] = rgba[i] ^ k;
        }
        
        image.bitmap.data = rgba;
        image.write(outputImageFile);
        
        fs.writeFileSync(outputKeyFile, Buffer.from(key).toString('base64'));
        
        alert({
            type: 'success',
            name: 'Image encrypted successfully',
            msg: `Image encrypted successfully:\nEncrypted Image: ${outputImageFile}\nKey: ${outputKeyFile}`
        });
    } catch (error) {
        alert({
            type: 'error',
            name: 'Error',
            msg: error.message || 'Unknown error'
        });
        throw error;
    }
};

module.exports = encrypt;
