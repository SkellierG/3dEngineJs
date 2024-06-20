import fs from 'fs';
import path from 'path';

async function readDirectory(root, folderPath) {
    const fullPath = path.join(root, folderPath)
    fs.readdir(fullPath, (err, files)=>{
        if (err) {
            console.error("Reading folder fails", err);
            return;
        }
        console.error("Readig folder ", folderPath, files);
        return files;
    })
};

export default readDirectory;