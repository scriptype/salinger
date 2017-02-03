![Salinger](https://github.com/scriptype/salinger/blob/master/salinger.png?raw=true)

> Ecosystem-free and flexible task runner that goes well with npm scripts.

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
 - A json file apparently is not the most comfortable place to write scripts in it.

Salinger provides a well structured environment to organize the scripts. Every script have its own file. Scripts can be anything (currently: `sh`, `js`, `py`, `rb`, `pl`, `lua`). There are multiple intuitive ways to inject variables to the scripts, whichever you like.

Salinger has no ecosystem of plugins to adapt to. Use the core packages instead. You can use/write – for example – a Python script inside Salinger, if that's the easiest way to accomplish a task for you.

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
   
   Let's install a package to use in the js task. `npm i -D browserify`
   
   ```
  "devDependencies": {
    "browserify": "^14.0.0"
  }
   ```
   
 - As the scripts imply, there should be something named **run**. Well, that's actually the folder in which we manage our tasks. So, in the project root, there's a **run** directory. The folder tree then looks like this:
 
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
   
   Note how we didn't provide an entry point to `bam.py` in the package.json. Your package, your decision.
   
 - **index.js** is checking whether the given command is handled in tasks. If so, calls it.
   
 - Inside **env.js**, define environment variables. They'll be available to all your scripts through `process.env`:
 
   ```js
  var path = require('path')

  module.exports = {
    HELLO: 'hello',
    BYE: 'bye',
    JS_IN: path.join(__dirname, '..', 'src', 'app.js'),     // Assuming you have this folder structure
    JS_OUT: path.join(__dirname, '..', 'dist', 'bundle.js')
  }
   ```
 
 - Inside **tasks.js** you are mapping commands coming from npm scripts to the actual tasks and orchestrating them however you like. For our example, tasks.js would be like:
 
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
   
   No handler for bam. It's obviously a private script for `start`. Exported methods should reflect what you call them in package.json. It's up to your imagination what you do inside these methods, though. When you `run` a task, you are given a Promise interface to hook and chain it with other tasks. The first argument of `run` is the filename of the script. The second parameter is optional and it defines task-specific environment variables.
   
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
