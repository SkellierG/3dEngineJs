import writeFile from '../coreEngine/fileSytem/writeFile.js';
import readDirectory from '../coreEngine/fileSytem/readDirectory.js';
import selectProjectRoot from '../coreEngine/fileSytem/selectProjectRoot.js';

class FileSystem {
    constructor() {
        this.root = selectProjectRoot;
        this.writeFile = writeFile;
        this.readDirectory = readDirectory;
    }
}

export default FileSystem;