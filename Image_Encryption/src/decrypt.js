const alert = require('cli-alerts');
const fs = require('fs');
const jimp = require('jimp');
const path = require('path');

const decrypt = async (flags) => {
    const filePath = flags.d;
    const keyPath = flags.k;
    if (!filePath || !keyPath) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path and key file path'
        });
        throw new Error('Invalid file path or key file path');
    }

    const fullPath = path.resolve(filePath);
    const fullKeyPath = path.resolve(keyPath);

    if (!fs.existsSync(fullPath) || !fs.existsSync(fullKeyPath)) {
        alert({
            type: 'warning',
            name: 'Invalid file path',
            msg: 'Please provide a valid file path and key file path'
        });
        throw new Error('Invalid file path or key file path');
    }

    try {
        const image = await jimp.read(fullPath);
        const keyBase64 = fs.readFileSync(fullKeyPath, 'utf8');
        const key = Buffer.from(keyBase64, 'base64');

        if (key.length !== image.bitmap.data.length) {
            alert({
                type: 'error',
                name: 'Invalid key',
                msg: 'The key length does not match the image data length'
            });
            throw new Error('Invalid key length');
        }

        const rgba = image.bitmap.data;
        const length = rgba.length;
        
        for (let i = 0; i < length; i++) {
            const k = key[i];
            rgba[i] = rgba[i] ^ k;
        }

        image.bitmap.data = rgba;

        let outputImageFile = path.resolve(filePath).replace('_encrypted', '_decrypted');
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

        image.write(outputImageFile);

        alert({
            type: 'success',
            name: 'Image decrypted successfully',
            msg: `Image decrypted successfully:\nDecrypted Image: ${outputImageFile}`
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

module.exports = decrypt;
