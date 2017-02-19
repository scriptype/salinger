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
 - It's unpleasant reading several long lines of CLI code in the `package.json`. Not eye candy, at best.
 - Sometimes you _may_ want to use the programmatic API of a tool for a given task. Well, you can't do that in `package.json` without:
   - a) Writing the js code in one line, with full of backslashes, as a parameter to `node -e`
   - b) Creating a separate file for the script and referencing it from the related npm script, which breaks the integrity of script definitions. Some scripts live in their own module while others are directly written inside the `package.json`.
 - A json file is apparently not the most comfortable place to write the whole script contents in it. Its syntax rules are prohibitive against writing complex code in it.
 - Creating and using variables is counterintuitive.
 - Use [Makefile](https://github.com/scriptype/Makefile-for-the-Front-End) to have more space, freedom and organization? It's all sweet until you think "[well, this task better be written with Node.js](https://github.com/scriptype/Makefile-for-the-Front-End/blob/master/Makefile#L112)", which takes you to the point _b)_ above. Also, the resources for learning Make will be mostly some old-style stuff that targets C developers.

## What Salinger offers
 - A well structured build environment.
 - Scripts can be written in any of these: `Unix Shell`, `JavaScript`, `Python`, `Ruby`, `Perl`, `Lua`.
 - Use CLI or programmatic API for a given task, whatever suits your needs better.
 - Intuitive ways to inject variables to the scripts.
 - No ecosystem of plugins to adapt to. Use the core packages.
 - A compact package.json
 - Chaining mechanism via promises between the scripts.
 - Almost non-existent learning curve.

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
   
 - Next, we need a folder named `scripts` in the root directory of our project. We'll use this folder as the home directory for Salinger tasks. The folder contents will look like this:
 
   ```
├─┬ scripts/
│ ├── env.js
│ ├── tasks.js
│ └─┬ tasks/
│   ├── server.sh
│   ├── hello.js
│   └── bye.py
   ```
   
   Run this in the project root to setup the above folder structure:
   
   ```sh
   $(npm bin)/salinger-setup
   # for Cygwin and Git Bash: node_modules/salinger/bin/setup.sh
   ```
   
   You can rename the `scripts` to anything. But, if you do that, make sure you have this `config` field in the package.json:
   ```json
   "config": {
     "salinger-home": "custom_folder_name"
   }
   ```
   
   Pro-tip: This is the only customizable part of Salinger. You can change this config key and Salinger will look up that folder to find the tasks and everything.
   
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
      run('server')
    },
    
    helloWorld(hereComesMyCLIParameter) {
      run('hello')
        .then(_ => run('world', {
          FOO: 'bar'
        }))
        .then(_ => run('bye', {
          LOVELY_PARAMETER: hereComesMyCLIParameter
        }))
        .then(_ => {
          console.log('All done!')
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
  console.log('hello')
   ```
 
   **tasks/world.js**
   ```js
  console.log(process.env.FOO)
   ```
 
   **tasks/bye.py** <sub>(This requires `python` executable in the `$PATH`. Change this to `sh`/`js` if you don't have Python installed.)</sub>
   ```py
  import os
  print(os.environ['LOVELY_PARAMETER'])
   ```
   
   
 - Finally, let's check what we got:
 
   ```sh
   npm start
   # starts an http server at 8081
   ```
 
   ```sh
   npm run helloWorld
   # logs "hello"
   # logs "bar"
   # logs "someParameter"
   # logs "All done!"
   ```

## Windows support

Salinger may or may not work on `cmd.exe`. Consider using one of these:

 - [Git Bash](https://git-scm.com/downloads)
 - [Cygwin](https://cygwin.com/install.html)
 - [Bash on Ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)
 
...and everything should be fine.

If you encounter a problem with Salinger on Windows, please see the [Windows Issues](https://github.com/scriptype/salinger/labels/windows) and open one if necessary.

## Credits

Many thanks to Ufuk Sarp Selçok ([@ufuksarp](https://twitter.com/ufuksarp)) for the project logo.
