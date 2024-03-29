#!/usr/bin/env node

const { program } = require("commander");
const inquirer = require("inquirer");
const simpleGit = require("simple-git");
const colors = require("colors");
const fuzzy = require("fuzzy");
const _ = require("lodash");

const package = require("../package.json");
const values = require("../lib/values");

inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

const git = simpleGit.default();

const getQuestions = () => {
  let questions = [];

  if (!options.type) {
    questions.push({
      name: "commitType",
      type: "autocomplete",
      message: "Choose the commit type:",
      choices: values.commitTypes,
      default: "feat",
      source: searchTypes,
    });
  }

  if (!options.scope) {
    questions.push({
      name: "commitScope",
      type: "input",
      message: "Enter the commit scope",
    });
  }

  if (!options.desc) {
    questions.push({
      name: "commitDesc",
      type: "input",
      message: "Enter the commit description",
    });
  }

  const commandLineOptions =
    typeof options.type !== "undefined" ||
    typeof options.scope !== "undefined" ||
    typeof options.desc !== "undefined";

  if (!options.nopush && !commandLineOptions) {
    questions.push({
      name: "wantsPush",
      type: "confirm",
      message: "Do you want to push your changes?",
      default: true,
    });
  }

  return questions;
};

const getCommitMessage = (options, answer) => {
  const commitMessage =
    (answer.commitType || options.type) +
    "(" +
    (answer.commitScope || options.scope) +
    "): " +
    (answer.commitDesc || options.desc);
  if (!options.dryrun)
    console.log(
      colors.white.bold("Commit message:"),
      colors.cyan(commitMessage)
    );
  return commitMessage;
};

function searchTypes(_answers, input) {
  input = input || "";
  return new Promise(function (resolve) {
    setTimeout(function () {
      var fuzzyResult = fuzzy.filter(input, values.commitTypes);
      const results = fuzzyResult.map(function (el) {
        return el.original;
      });
      resolve(results);
    }, _.random(30, 500));
  });
}

const runGitCommands = async (commitMessage, add, push) => {
  if (options.dryrun) {
    console.log(
      colors.white("The"),
      colors.white.bold("--dryrun"),
      colors.white("option was provided. No commands were executed this run.")
    );
    console.log(
      colors.white("This command would have run the following"),
      colors.white.bold("git"),
      colors.white("commands:")
    );
    if (add) console.log(colors.cyan("git add -v . && \\"));
    let gitCommitCmd = "git commit -m '" + commitMessage + "'";
    if (push) gitCommitCmd += " && \\";
    console.log(colors.cyan(gitCommitCmd));
    if (push) console.log(colors.cyan("git push origin HEAD"));
  } else {
    try {
      if (add) console.log(colors.white("Adding files to be tracked..."));
      if (add) await git.add(".");
      console.log(colors.white("Committing changes..."));
      await git.commit(commitMessage);
      if (push) console.log(colors.white("Pushing changes to remote..."));
      if (push) await git.push("origin", "HEAD");
    } catch (e) {
      console.log("error: ", e);
    }
  }
};

const runCommit = async (questions) => {
  if (questions.length === 0) {
    const commitMessage = getCommitMessage(options, {
      commitType: false,
      commitScope: false,
      commitDesc: false,
    });
    runGitCommands(commitMessage, !options.noadd, !options.nopush);
  } else if (questions.length > 0)
    inquirer
      .prompt(questions)
      .then(async (answer) => {
        const commitMessage = getCommitMessage(options, answer);
        runGitCommands(
          commitMessage,
          !!options.noadd,
          answer.wants_push && !options.nopush ? true : false
        );
      })
      .catch(async (err) => {
        console.log(err);
      });
};

program
  .description("A command line utility for git add/commit/push")
  .option("-np, --nopush", "Do not `git push`")
  .option("-na, --noadd", "Do not `git add`")
  .option("-t, --type <type>", "The commit type")
  .option("-s, --scope <scope>", "The commit scope")
  .option("-d, --desc <desc>", "The commit description")
  .option("-D, --dryrun", "Print the commands but don't execute them");

program.version(package.version);

program.parse();

const options = program.opts();

const questions = getQuestions();

runCommit(questions);
