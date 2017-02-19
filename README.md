![Salinger](https://github.com/scriptype/salinger/blob/master/salinger.png?raw=true)

> Ecosystem-free task runner that goes well with npm scripts.

[![Travis Status Badge](https://api.travis-ci.org/scriptype/salinger.svg?branch=master)](https://travis-ci.org/scriptype/salinger) [![AppVeyor Status Badge](https://ci.appveyor.com/api/projects/status/6e5tqfcgd3ihlksa?svg=true)](https://ci.appveyor.com/project/scriptype/salinger-npm) [![Coverage Status Badge](https://coveralls.io/repos/github/scriptype/salinger/badge.svg?branch=master)](https://coveralls.io/github/scriptype/salinger?branch=master) [![Code Climate Badge](https://codeclimate.com/github/scriptype/salinger/badges/gpa.svg)](https://codeclimate.com/github/scriptype/salinger) [![bitHound Overall Score Badge](https://www.bithound.io/github/scriptype/salinger/badges/score.svg)](https://www.bithound.io/github/scriptype/salinger)

Salinger is (almost) just a Promise wrapper around the native `fs.exec()` calls. And it replaces your favorite task runner.

Easy to step in, easy to step out. No attachment to the glue modules between the runner and the tools.

![Salinger walk-through](https://cdn.rawgit.com/scriptype/salinger/master/walkthrough.svg)

## Contents

- [What Salinger offers](#what-salinger-offers)
- [An example with `npm run-scripts` and Salinger](#an-example-with-npm-run-scripts-and-salinger)
- [Motivation](#motivation)
- [Install](#install)
- [Getting started](#getting-started)
- [Docs](#docs)
 - [Salinger.run()](#salingerrun)
 - [Changing the default `scripts` directory](#changing-the-default-scripts-directory)
 - [Environment variables](#environment-variables)
- [Trade-offs](#trade-offs)
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
    this.foo().then(this.bar)
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

Let's check what we got:
 
```sh
npm start
# starts an http server at 8081
```

## Docs

### Salinger.run()

Currently being the only member of Salinger's API, run takes two parameters and returns a `Promise`:

 - Filename of the script to run. This doesn't include the extension and it's not a path; just the filename. If Salinger finds a file with the supplied filename and a supported extension, it will execute it. Otherwise you'll see errors on your console. 
   
   If there are multiple files with the same name but different extensions, only one of them will be selected every time (Lookup order is: `sh`, `js`, `py`, `rb`, `pl`, `lua`).
 
 - Optional - Environment variables specific to this run call. See: [Environment variables](#environment-variables).

```js
run('do-things', {
  HELLO: 'world'
})
```

You can chain run calls just like any other `Promise`:

```js
run('foo')
  .then(_ => run('bar'))
  .then(_ => run('bam'))
```

Concurrently executing scripts is a no-brainer:

```js
run('foo')
run('bar')
```

You can use `Promise.all`, `Promise.race` etc.

One interesting pattern would be chaining and reusing the exported Salinger tasks:

```js
// scripts/tasks.js
var run = require('salinger').run

module.exports = {

  lorem() {
    return run('foo')
  },

  ipsum() {
    return run('bar')
  },
  
  dolor() {
    this.lorem()
      .then(_ => run('grapes', { HERE: 'A_VARIABLE' }))
      .then(this.ipsum)
      .then(_ => run('trek'))
  }
}
```

### Changing the default `scripts` directory

You can choose to have Salinger-related files in a different folder. If that is the case, just add this config to your `package.json`:

```json
"config": {
  "salinger-home": "path/to/new-folder"
}
```

Now, you can move everything to that folder and Salinger will start to work with that path. Just be aware that you may need to fix any paths you set in `env.js`.

### Environment variables

There must be a file named `env.js` in the salinger-home directory. Values exported from this module will be accessible to all tasks through `process.env`. A sample `env.js` may look like this:

```js
var path = require('path')

const SRC = path.join(__dirname, '..', 'src')
const DIST = path.join(__dirname, '..', 'dist')

const PORT = 8080

module.exports = {
  SRC,
  DIST,
  PORT
}
```

This will extend the process.env during the execution of the scripts.

Also, Salinger's run method takes an optional second parameter which also extends process.env with the provided values. But, these values are available only for this specific `run` call. Let's say we run a script from a task, like this:

```js
myTask(these, parameters, are, coming, from, CLI) {

  // Maybe do some logic depending on the values of CLI parameters.
  // ...

  run('my-script', {
  
    // Or inject those parameters as environment variables to a script
    these: these,
    parameters: parameters,
    are: are,
    from: from,
    CLI: CLI,
    
    // Let's pass a variable that conflicts with an existing key in the env.js
    PORT: 5001
    
  })
  
}
```

And, of course, add an entry point for this task to package.json:

```json
"scripts": {
  "myTask": "salinger myTask hello there from planet earth"
}
```

Say, this is a production environment and there's already a `PORT` environment variable independent from all of these. Now when we run `npm run myTask`, that PORT variable will be overridden by 8080, since it's defined in env.js. And, since we specify that variable again, in the second parameter of run call of 'my-script', it gets overriden again just for this execution of 'my-script'. So, `PORT` is 5001 for my-script, only for this call.

What's exported from env.js, though, will be accessible from process.env (not persistent) during the execution of the scripts. So, checking a key's existence before declaring it would help.

## Trade-offs

## Windows support

Salinger may or may not work on `cmd.exe`. Consider using one of these:

 - [Git Bash](https://git-scm.com/downloads)
 - [Cygwin](https://cygwin.com/install.html)
 - [Bash on Ubuntu on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)
 
...and everything should be fine.

If you encounter a problem with Salinger on Windows, please see the [Windows Issues](https://github.com/scriptype/salinger/labels/windows) and open a new one if necessary.

## Credits

Many thanks to Ufuk Sarp Selçok ([@ufuksarp](https://twitter.com/ufuksarp)) for the project logo.
