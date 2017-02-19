![Salinger](https://github.com/scriptype/salinger/blob/master/salinger.png?raw=true)

> Ecosystem-free task runner that goes well with npm scripts.

[![Travis Status Badge](https://api.travis-ci.org/scriptype/salinger.svg?branch=master)](https://travis-ci.org/scriptype/salinger) [![AppVeyor Status Badge](https://ci.appveyor.com/api/projects/status/6e5tqfcgd3ihlksa?svg=true)](https://ci.appveyor.com/project/scriptype/salinger-npm) [![Coverage Status Badge](https://coveralls.io/repos/github/scriptype/salinger/badge.svg?branch=master)](https://coveralls.io/github/scriptype/salinger?branch=master) [![Code Climate Badge](https://codeclimate.com/github/scriptype/salinger/badges/gpa.svg)](https://codeclimate.com/github/scriptype/salinger) [![bitHound Overall Score Badge](https://www.bithound.io/github/scriptype/salinger/badges/score.svg)](https://www.bithound.io/github/scriptype/salinger)

Salinger is (almost) just a Promise wrapper around the native `fs.exec()` calls. And it replaces your favorite task runner.

Easy to step in, easy to step out. No attachment to the glue modules between the task runner and the build tools.

![Salinger walk-through](https://cdn.rawgit.com/scriptype/salinger/master/walkthrough.svg)

## Contents

- [What Salinger offers](#what-salinger-offers)
- [An example with `npm run-scripts` and Salinger](#an-example-with-npm-run-scripts-and-salinger)
- [Motivation](#motivation)
- [Install](#install)
- [Getting started](#getting-started)
- [Windows support](#windows-support)
- [Credits](#credits)

## What Salinger offers
 - A well structured build environment.
 - Write scripts in any of these: `Unix Shell`, `JavaScript`, `Python`, `Ruby`, `Perl`, `Lua`.
 - Use CLI or programmatic API for a given task, whatever suits your needs better.
 - Easily inject variables to the scripts.
 - No ecosystem of plugins to adapt to. Use the core packages.
 - A compact package.json
 - Orchestrate your scripts with promises.
 - Almost non-existent learning curve.

## An example with `npm run-scripts` and Salinger

Let's say we have some scripts in our `package.json`:

```json
"scripts": {
  "foo": "someCrazyComplicatedStuff && anotherComplicatedThingGoesRightHere",
  "bar": "aTaskThatRequiresYouToWriteThisLongScriptInOneLine",
  "fooBar": "npm run foo && npm run bar"
}
```

If we had used Salinger, the `package.json` would look like this:

```json
"scripts": {
  "foo": "salinger foo",
  "bar": "salinger bar",
  "fooBar": "salinger fooBar"
}
```

Then we would have a `scripts/tasks.js` like this:

```js
var run = require('salinger').run

module.exports = {
  foo() {
    return run('crazy_complicated')
      .then(_ => run('another_complicated'))
  },
  bar() {
    return run('my_long_script')
  },
  fooBar() {
    run(this.foo)
      .then(this.bar)
  }
}
```

Normally we wouldn't have to `return` in tasks if we didn't reuse them.

And we would have these files in `scripts/tasks/`:
```
crazy_complicated.sh
another_complicated.js
my_long_script.rb
```

Yes, they can be written in any scripting language.

So, what did we do here? We have separated the entry points, the orchestration/chaining part and the actual implementations.

- Keep the `package.json` clean and brief, it only has entry points to our build system.
- Chain the tasks and scripts in a more familiar and powerful way, in a fresh environment.
- Write the actual scripts in whatever way you want. CLI or programmatic; `sh` or `js` or... You decide.

## Motivation

After spending some time with npm scripts, problems arise:
 - It's unpleasant reading and writing several long lines of CLI code in the `package.json`. Not eye candy, at best.
 - A json file is apparently not the most comfortable place to write the whole script contents in it. Its syntax rules are prohibitive against writing any complex code in it.
 - The way of creating and using variables is counterintuitive.
 - We can't use the programmatic API of a tool in the `package.json` without:
   - a) Writing the js code in one line as a parameter to `node -e` (full of backslashes).
   - b) Creating a separate file for it, which breaks the integrity of script definitions. We have to organize these separate scripts somehow.
 
As a general note, an ideal task runner should run _any_ tasks we want it to. Not the _only tasks_ that are compliant with its API.

## Install

```
npm i -D salinger
```

## Getting started

We have a simple [boilerplate project](https://github.com/scriptype/salinger-basic-boilerplate). It'll surely help to understand better what's going on. Really, [check it out](https://github.com/scriptype/salinger-basic-boilerplate).

So, let's start a new project and use Salinger in it.

Initialize an empty project:
```sh
mkdir test-project
cd test-project
npm init -y
```

Add this script to the `package.json`:

```json
"scripts": {
  "start": "salinger start"
}
```

Let's have a dependency:
 
```sh
npm i -D http-server
```

Next, create a folder named `scripts` in the root directory of our project. We'll use this folder as the home directory for Salinger tasks. The folder contents will look like this:

```
├─┬ scripts/
│ ├── env.js
│ ├── tasks.js
│ └─┬ tasks/
│   └── server.sh
```
   
First, let's write the `tasks.js` inside the `scripts`. Create it and copy the below code and save it:

```js
var run = require('salinger').run

module.exports = {
  start() {
    run('server')
  }
}
```

So, we have a task that `npm start` will redirect to, whenever we call it. Any method you export here will be available as `salinger taskName`. Our `start` task runs a script called `server` but, we haven't created it yet. So, let's do it.

Create a folder named `tasks` inside our `scripts` folder. This folder will hold all future script files.

```sh
mkdir scripts/tasks
```

Then create `server.sh` in `scripts/tasks/` and copy the below code to it:

```sh
http-server -p $PORT
```

Our `server` script looks for `PORT` environment variable. Let's provide that.

Create `env.js` inside the `scripts` folder. Its content should be the following code:

```js
const PORT = process.env.PORT || '8081'

module.exports = {
  PORT
}
```

We've checked for an existing PORT variable – we usually have one in production environments. And if it doesn't exist, just use '8081', we said.

Variables you export from `env.js` is accessible from all scripts, via `process.env`.


 - Finally, let's check what we got:
 
   ```sh
   npm start
   # starts an http server at 8081
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
