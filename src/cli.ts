import inquirer from "inquirer";
import { createProject } from "./cli-helper";
import { Options } from "./types";

const arg = require("arg");

function parseArgumentsIntoOptions(rawArgs: string[]): Options {
  const args = arg(
    {
      "--git": Boolean,
      "--default": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-s": "--default",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    name: args._[0],
    template: args._[1],
    stateManagement: args._[2],
    skipPrompts: args["--default"] || false,
    git: args["--git"],
    runInstall: args["--install"],
  };
}

async function promptForMissingOptions(options: Options): Promise<Options> {
  const defaultName = "my-app";
  const defaultTemplate = "Next.js";
  const defaultStateManagement = "None";
  const defaultGit = true;
  const defaultRunInstall = true;

  const defaultOptions = {
    ...options,
    name: options.name || defaultName,
    template: options.template || defaultTemplate,
    stateManagement: options.stateManagement || defaultStateManagement,
    git: options.git || defaultGit,
    runInstall: options.runInstall || defaultRunInstall,
  }

  if (options.skipPrompts) {
    return defaultOptions;
  }

  const questions = [];
  // Application name
  // ==================
  if (!options.name) {
    questions.push({
      name: "name",
      message: "Please type project name:",
      default: defaultName,
    });
  }

  // Application template, Choices are ["Next.js", "Cra"],
  // =======================================================
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template/framework are you going to use:",
      choices: ["Next.js", "Cra"],
      default: defaultTemplate,
    });
  }

  // Using state management framework or not.
  // ==========================================
  if (!options.stateManagement) {
    questions.push({
      type: "list",
      name: "stateManagement",
      message: "Please choose state manangent you like:",
      choices: ["None", "Redux"],
      default: defaultStateManagement,
    });
  }

  // Using git or not.
  // ==================
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository:",
      default: defaultGit,
    });
  }

  // Automatically run install packages or not 
  // ===========================================
  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Run install:",
      default: defaultRunInstall,
    });
  }

  const answers: Options = await inquirer.prompt(questions);

  return {
    ...options,
    ...answers
  };
}

export async function cli(args: string[]) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
