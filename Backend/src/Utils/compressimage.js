import sharp from 'sharp';

export const compressImage = async (filePath, outputPath) => {
        await sharp(filePath)
        .resize({width:1920})
        .jpeg({ quality: 85 })
        .toFile(outputPath);
    return  outputPath;
};