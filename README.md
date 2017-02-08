![Salinger](https://github.com/scriptype/salinger/blob/master/salinger.png?raw=true)

> Ecosystem-free and flexible task runner that goes well with npm scripts.

[![Travis Status Badge](https://api.travis-ci.org/scriptype/salinger.svg?branch=master)](https://travis-ci.org/scriptype/salinger)

[![AppVeyor Status Badge](https://ci.appveyor.com/api/projects/status/6e5tqfcgd3ihlksa?svg=true)](https://ci.appveyor.com/project/scriptype/salinger-npm)

[![Code Climate Badge](https://codeclimate.com/github/scriptype/salinger/badges/gpa.svg)](https://codeclimate.com/github/scriptype/salinger)

## Contents

- [Motivation](#motivation)
- [How it works](#how-it-works)
- [Integration](#integration)
- [Credits](#credits)

## Motivation

Npm run scripts are great, but after spending some time with them, you notice that things are constantly getting messier. Wish we had more space and structure for our run scripts, to write them with full enjoyment. Here are some pain points:
 - It doesn't feel great reading 15+ lines of CLI code, each 100+ characters in your `package.json`.
 - Sometimes you feel like using the programmatic API for a task. Well, you can't do that in `package.json` without:
   - a) Writing the js code in one line, with full of backslashes, as a parameter to `node -e`
   - b) Creating a separate file for the script and referencing it from the npm script, which breaks the integrity of script definitions. Now your code looks unmaintainable.
 - A json file is apparently not the most comfortable place to write whole script contents in it.
 - Use [Makefile](https://github.com/scriptype/Makefile-for-the-Front-End) to have more space, freedom and organization? It's all sweet until you think "[well, this task better be written with Node.js](https://github.com/scriptype/Makefile-for-the-Front-End/blob/master/Makefile#L112)", which takes you to the point _b)_ above. Also, the resources for learning will be mostly some old-style stuff that targets C audience.

Salinger provides a well structured environment to organize the scripts. Every script has its own file. Scripts can be anything (currently: `sh`, `js`, `py`, `rb`, `pl`, `lua`). There are multiple intuitive ways to inject variables to the scripts, whichever you like.

Salinger has no ecosystem of plugins to adapt to. Use the core packages instead. There won't be a `salinger-uglify`.

Tools that we use for various tasks can have a good CLI and a rather complex API (or vice versa). You should be writing the one you are most comfortable with. Salinger got your back there. You can even use/write – for example – a Python script inside Salinger, if that's the easiest way to accomplish a task for you. Not super useful for everyone, but why not support it while it's a _no-op_ for the library.

Salinger is basically a folder structure boilerplate with an additional tiny library to wrap the scripts with Promise interface, so a solid orchestration is made possible.

Run binaries in node_modules directly with their name, just like you do in package.json


## How it works

 - Define the tasks in the `package.json`:
 
   ```json
  "scripts": {
    "start": "node run start",
    "foo": "node run foo",
    "bar": "node run bar lorem ipsum",
    "js": "node run js"
  }
   ```
   
   Let's `npm i -D browserify` to use in the js task.
   
   ```
  "devDependencies": {
    "browserify": "^14.0.0"
  }
   ```
   
 - As the scripts imply, there should be something named **run**. Well, that's actually the folder in which we manage our tasks. So, in the project root, there's a **run** directory with some files in it. The folder tree then looks like this:
 
   ```
├── package.json
├─┬ run/
│ ├── index.js
│ ├── env.js
│ ├── tasks.js
│ ├── lib/ (Salinger's own library code lives here)
│ └─┬ tasks/
│   ├── foo.sh
│   ├── bar.js
│   ├── bam.py
│   └── browserify.sh
   ```
   
   Note that there isn't an exact mapping between npm scripts and the file names inside the `tasks/`. It's not needed, as we'll map them later. I intentionally did that to better illustrate the system.
   
 - [**index.js**](https://github.com/scriptype/salinger/blob/master/run/index.js) is checking whether the given command is handled in tasks. If so, calls it.
   
 - Inside [**env.js**](https://github.com/scriptype/salinger/blob/master/run/env.js), define environment variables. They'll be available to all your scripts through `process.env`:
 
   ```js
  var path = require('path')

  module.exports = {
    HELLO: 'hello',
    BYE: 'bye',
    JS_IN: path.join(__dirname, '..', 'src', 'app.js'),     // Assuming you have this folder structure
    JS_OUT: path.join(__dirname, '..', 'dist', 'bundle.js')
  }
   ```
 
 - Inside [**tasks.js**](https://github.com/scriptype/salinger/blob/master/run/tasks.js) you are mapping commands coming from npm scripts to the actual tasks and orchestrating them however you like. For our example, tasks.js would be like:
 
   ```js
  var run = require('./lib/run')

  module.exports = {
    start() {
      // just promise logic.
      run('foo')
        .then(_ => run('bam'))
      run('bar')
        .then(_ => run('browserify'))
    },
    
    foo() {
      run('foo', {
        HOW_ABOUT_INJECTING_SOME_VARS_HERE: 'indeed'
      })
    },
    
    bar(lorem, ipsum) {
      console.log('here are some arguments supplied from cli', lorem, ipsum)
      run('bar', {
        IS_LOREM: !!lorem,
        IS_IPSUM: !!ipsum,
      })
    },
    
    js() {
      run('browserify')
    }
  }
   ```
   
     - No handler for bam. It's obviously a private script for `start`.
     - Names of the exported methods should reflect what you call them in package.json. It's up to your imagination what you do inside these methods, though.
     - The first argument of `run` is the filename of the script.
     - The second parameter is optional and it defines task-specific environment variables. Every run call is able to carry its own environment variables, thanks to this second parameter.
     - When you `run` a task, you are given a Promise interface to hook and chain it with other tasks.
   
 - Finally, the scripts:
 
   **run/tasks/foo.sh**
   
   ```sh
  echo $HELLO $HOW_ABOUT_INJECTING_SOME_VARS_HERE
   ```
 
   **run/tasks/bar.js**
   ```js
  var {
    BYE,
    IS_LOREM,
    IS_IPSUM
  } = process.env
  console.log(BYE, IS_LOREM, IS_IPSUM)
   ```
 
   **run/tasks/bam.py**
   ```py
  import os
  print(os.environ['HELLO'] + ' and ' + os.environ['BYE'])
   ```
 
   **run/tasks/browserify.sh**
   ```sh
  browserify \
    --outfile $JS_OUT \
    --debug \
    $JS_IN
   ```

## Integration

```sh
curl https://raw.githubusercontent.com/scriptype/salinger/master/integration.sh | sh
```

## Credits

Many thanks to Ufuk Sarp Selçok ([@ufuksarp](https://twitter.com/ufuksarp)) for the project logo.
