mkdir __test
cd __test

npm init -y > $null

cp ..\scripts\files\scripts . -recurse

node ..\scripts\helpers\packageJsonScripts `
  package.json `
  start "node ..\bin\index.js start" `
  lorem "node ..\bin\index.js lorem"

npm start
npm run lorem

cd ..
rm -r __test
