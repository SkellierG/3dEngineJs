import fs from 'fs';

let projectRoot;

function setProjectRoot(rootPath) {
    if (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isDirectory()) {
        projectRoot = rootPath;
        console.log(`project root in ${projectRoot}`);
    } else {
        console.log('not a folder or invalid route');
    }
}

function getProjectRoot() {
    if (!projectRoot) {
        console.log('Not project Root detected');
    }
    return projectRoot;
}

export default { setProjectRoot, getProjectRoot };
