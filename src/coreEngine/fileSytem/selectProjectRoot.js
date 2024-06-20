import inquirer from "inquirer";
import fs from 'fs';

async function selectProjectRoot() {
    const answers = await inquirer.prompt([{
        type: "input",
        name: "projectRoot",
        message: "Insert Your Project Root Folder",
        validate: (input)=>{
            if (fs.existsSync(input) && fs.lstatSync(input).isDirectory()) {
                return true;
            }
            console.log("not a folder or not valid route");
            return "not a folder or not valid route";
        }
    }]);
    return answers.projectRoot;
};

export default selectProjectRoot;