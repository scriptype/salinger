mkdir __test
cd __test

npm init -y > $null

sh ..\bin\setup.sh

node ..\scripts\helpers\packageJsonScripts `
  package.json `
  hello "node ..\bin\index.js hello" `

echo "module.exports = {MY_VAR:'my-var'}" > scripts/env.js
echo "var run=require('../..').run;exports.hello=()=>run('hello')" > scripts/tasks.js
echo "if(process.env['MY_VAR']!=='my-var')throw 'not ok' " > scripts/tasks/hello.js

npm run hello

cd ..
rm -r __test
