import FileSystem from './ClassFileSystem.js'

const date = new Date;
console.log("date: ", date);

class Project {
    constructor(name) {
        if (name) {
            this.name = name;
        } else {
            this.name = `New Project ${date}`;
        }
        this.creationDate = `${date}`;
        this.fs = new FileSystem();
    }
}

export default Project;