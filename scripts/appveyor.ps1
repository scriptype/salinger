mkdir __test
cd __test

npm init -y > $null

sh ..\bin\setup.sh

node ..\scripts\helpers\packageJsonScripts `
  package.json `
  hello "node ..\bin\index.js hello"

echo "module.exports = {MY_VAR:'my-var'}" | out-file -encoding ASCII scripts/env.js
echo "var run=require('../..').run;exports.hello=()=>run('hello')" | out-file -encoding ASCII scripts/tasks.js
echo "if(process.env['MY_VAR']!=='my-var')throw 'not ok' " | out-file -encoding ASCII scripts/tasks/hello.js

npm run hello

cd ..
rm -r __test
