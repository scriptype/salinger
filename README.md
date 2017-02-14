![Salinger](https://github.com/scriptype/salinger/blob/master/salinger.png?raw=true)

> Ecosystem-free and flexible task runner that goes well with npm scripts.

[![Travis Status Badge](https://api.travis-ci.org/scriptype/salinger.svg?branch=master)](https://travis-ci.org/scriptype/salinger) [![AppVeyor Status Badge](https://ci.appveyor.com/api/projects/status/6e5tqfcgd3ihlksa?svg=true)](https://ci.appveyor.com/project/scriptype/salinger-npm) [![Coverage Status Badge](https://coveralls.io/repos/github/scriptype/salinger/badge.svg?branch=master)](https://coveralls.io/github/scriptype/salinger?branch=master) [![Code Climate Badge](https://codeclimate.com/github/scriptype/salinger/badges/gpa.svg)](https://codeclimate.com/github/scriptype/salinger) [![bitHound Overall Score Badge](https://www.bithound.io/github/scriptype/salinger/badges/score.svg)](https://www.bithound.io/github/scriptype/salinger)

## Contents

- [Motivation](#motivation)
- [What Salinger offers](#what-salinger-offers)
- [Install](#install)
- [Getting started](#getting-started)
- [Windows support](#windows-support)
- [Credits](#credits)

## Motivation

Npm run scripts are a great way to organize the build scripts of a Node.js project, but after spending some time with them, chances are the `package.json` will end up looking like a mess. Wish we had more space and structure for our run scripts, to write them with full enjoyment. Having to write long-ish shell scripts as one-liners doesn't feel particularly great (or, is it just me?). Here are some common issues with writing npm scripts:
 - It's unpleasant reading 10+ consecutive lines of CLI code, each 100+ characters in your `package.json`.
 - Sometimes you _may_ want to use the programmatic API of a tool for a given task. Well, you can't do that in `package.json` without:
   - a) Writing the js code in one line, with full of backslashes, as a parameter to `node -e`
   - b) Creating a separate file for the script and referencing it from the related npm script, which breaks the integrity of script definitions. Some scripts live in their own module while others are directly written inside the `package.json`.
 - A json file is apparently not the most comfortable place to write the whole script contents in it. Its syntax rules are prohibitive against writing complex code in it.
 - Creating and using variables is counterintuitive.
 - Use [Makefile](https://github.com/scriptype/Makefile-for-the-Front-End) to have more space, freedom and organization? It's all sweet until you think "[well, this task better be written with Node.js](https://github.com/scriptype/Makefile-for-the-Front-End/blob/master/Makefile#L112)", which takes you to the point _b)_ above. Also, the resources for learning Make will be mostly some old-style stuff that targets C developers.

## What Salinger offers
 - A well structured environment to organize the build tasks.
 - Scripts can be written in any language (currently: `Unix Shell`, `JavaScript`, `Python`, `Ruby`, `Perl`, `Lua`).
 - There are multiple intuitive ways to inject variables to the scripts.
 -  No ecosystem of plugins to adapt to. Use the core packages instead. There won't be a `salinger-plugin-whatever`.
 - Tools we use can have a good CLI and a rather complex API (or vice versa). With Salinger, we can use whichever we want for a task.
 - Every script has its own file.
 - `scripts` field in the `package.json` is still used, but only as entry points for Salinger tasks. They are very short.
 - Scripts are run inside promise wrappers, so it's trivial to implement chaining mechanisms between the them.
 - No magic, instant grasp of the full system, almost non-existent learning curve.
 - In a script, `node_module`s are directly callable with their names, as in package.json.
 - Concrete library. No moving parts other than a home directory config.

## Install

```
npm i -D salinger
```

## Getting started

 - Define the scripts in the `package.json`:
 
   ```json
  "scripts": {
    "start": "salinger start",
    "helloWorld": "salinger helloWorld someParameter"
  }
   ```
   
   We create two scripts: `start` and `helloWorld`, which takes `someParameter`.
 
 - Let's have a dependency:
 
   ```sh
   npm i -D http-server
   ```
   
 - Next, you need a folder named `scripts` in the root directory of your project. We'll use this folder as the home directory for Salinger tasks. The folder contents will look like this:
 
   ```
├─┬ scripts/
│ ├── env.js
│ ├── tasks.js
│ └─┬ tasks/
│   ├── server.sh
│   ├── hello.js
│   └── bye.py
   ```
   
   To setup this folder structure with no effort, run this in the project root:
   
   (**[This doesn't work on Windows](https://github.com/scriptype/salinger/issues/2)**)
   
   ```sh
   salinger_home="scripts" $(npm bin)/salinger-setup
   ```
   
   You can change the `salinger_home="scripts"` to `salinger_home="any-folder-name-i-want"`. But, if you do that, make sure you have this lines in the package.json:
   ```json
   "config": {
     "salinger-home": "any-folder-name-i-want"
   }
   ```
   
   Pro-tip: This is the only customizable part of Salinger. You can change this config key whenever you want and Salinger will look up that folder to find the tasks and everything.
   
 - Inside `env.js`, define environment variables:
 
   ```js
  module.exports = {
    FOO: 'foo',
    PORT: 8081
  }
   ```
 
 - `tasks.js` is the place to map the npm run commands to the actual scripts. The scripts are called via Salinger's exported run method. `run(...)` returns a promise, so it's up to your imagination how to chain and hook the run calls with each other:
 
   ```js
  var run = require('salinger').run

  module.exports = {
    start() {
      console.log('I can debug here')
      run('server')
    },
    
    helloWorld(hereComesMyCLIParameter) {
        run('hello', {
          HOW_ABOUT_INJECTING_SOME_VARS_HERE: hereComesMyCLIParameter
        })
        .then(_ => run('bye', {
          FOO: 'bar'
        })
        .then(_ => {
          console.log('i do whatever i want with all these promises')
        })
    }
  }
   ```
   
     - Names of the exported methods (Salinger tasks) should reflect what you call them in package.json.
     - File names of the scripts, on the other hand, should be the same as what you call them in `run()` calls.
   
 - The scripts:
 
   **tasks/server.sh**
   
   ```sh
  http-server -p $PORT
   ```
 
   **tasks/hello.js**
   ```js
  console.log(process.env.HOW_ABOUT_INJECTING_SOME_VARS_HERE)
   ```
 
   **tasks/bye.py**
   ```py
  import os
  print(os.environ['FOO'])
   ```
   
 - Finally, let's check what we got:
 
   ```sh
   npm start
   # logs "i can debug here"
   # starts an http server at 8081
   ```
 
   ```sh
   npm run helloWorld
   # logs "someParameter"
   # logs "bar"
   # logs "i do whatever i want with all these promises"
   ```

## Windows support

Salinger tries to be as friendly as possible with Windows, but `cmd.exe` isn't supported. Anything you do with Salinger should work in [Git Bash](https://git-scm.com/downloads) and [Cygwin](https://cygwin.com/install.html), and you should be using a tool like one of these, anyway.

I didn't try [Bash on Ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about). Theoretically, everything should be fine there.

If you encounter a problem when using Salinger on Windows, please check out the [Windows Issues](https://github.com/scriptype/salinger/labels/windows).

## Credits

Many thanks to Ufuk Sarp Selçok ([@ufuksarp](https://twitter.com/ufuksarp)) for the project logo.
