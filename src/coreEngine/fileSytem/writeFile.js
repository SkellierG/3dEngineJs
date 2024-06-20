import fs from 'fs';
import path from 'path';

async function writeFile(root, folderPath, fileName, content) {
    const filePath = path.join(root, folderPath, fileName);
    fs.write(filePath, content, (err)=>{
        if (err) {
            console.error("error writing a file", err);
            return;
        }
        console.log("file "+fileName+" written in "+path.join(root, folderPath));
        return true;
    });
};

export default writeFile;