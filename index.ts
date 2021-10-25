#!/usr/bin/env node

let shell = require("shelljs");
let colors = require("colors");

export const createProject = async (opt: { name: any; template: string; runInstall: any; }) => {
  let appName = opt.name;
  let appDirectory = `${process.cwd()}/${appName}`;
  let success: boolean = false;

  console.log(`\nPlease wait while we preparing the template for you...`, colors.blue);
  console.log("Just sit back and relax, take your coffee. 😊\n", colors.blue);

  switch (opt.template.toLowerCase()) {
    case "next.js":
      success = await createNextJs(appName);
      break;
    case "cra":
      success = await createReactApp(appName);
      break;
    default:
      break;
  }

  if (!success) {
    console.log(
      `Something went wrong while trying to create a new React app using ${opt.template}`, colors.red
    );
    return false;
  }

  if (opt.runInstall) {
    await cdIntoNewApp(appDirectory);
    await installPackages(opt);
  }

  console.log("==================================================");
  console.log("======================= ** =======================");
  console.log("====================== *++* ======================");
  console.log("===================== *++++* =====================");
  console.log("==================== *++++++* ====================");
  console.log("=================== *++++++++* ===================");
  console.log("================== *++++++++++* ==================");
  console.log("================= *  All done  * =================");
  console.log("================ * Happy coding * ================");
  console.log("=============== *++++++++++++++++* ===============");
  console.log("============== *++++++++++++++++++* ==============");
  console.log("=================== *++++++++* ===================");
  console.log("=================== *++++++++* ===================");
  console.log("==================================================");
};

const createNextJs = (appName: any): Promise<boolean> => {
  return new Promise((resolve) => {
    if (appName) {
      shell.exec(`npx create-next-app ${appName} --typescript`, (code: any) => {
        console.log("Exited with code ", code);
        console.log("Created next.js app");
        resolve(true);
      });
    } else {
      console.log("\nNo app name was provided.", colors.red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ndhi-react-app ", "app-name\n", colors.cyan);
      resolve(false);
    }
  });
};

const createReactApp = (appName: any): Promise<boolean> => {
  return new Promise((resolve) => {
    if (appName) {
      shell.exec(
        `npx create-react-app ${appName} --template typescript`,
        (code: any) => {
          console.log("Exited with code ", code);
          console.log("Created react app");
          resolve(true);
        }
      );
    } else {
      console.log("\nNo app name was provided.", colors.red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ndhi-react-app ", "app-name\n", colors.cyan);
      resolve(false);
    }
  });
};

const cdIntoNewApp = (appDirectory: string): Promise<boolean> => {
  return new Promise((resolve) => {
    shell.cd(appDirectory);
    resolve(true);
  });
};

const installPackages = (opt: { name?: any; template?: string; runInstall?: any; stateManagement?: any; }): Promise<boolean> => {
  return new Promise((resolve) => {
    switch (opt.stateManagement.toLowerCase()) {
      case "redux":
        console.log("\nInstalling redux react-router react-redux redux-thunk react-router-dom...\n", colors.cyan);
        shell.exec(
          `yarn add -D redux react-router react-redux redux-thunk react-router-dom`,
          () => {
            console.log("\nFinished installing packages\n", colors.green);
            resolve(true);
          }
        );
        break;
      default:
        resolve(true);
        break;
    }
  });
};
