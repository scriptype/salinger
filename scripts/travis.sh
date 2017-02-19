mkdir __test
cd __test

npm init -y > /dev/null

cp -R ../scripts/files/scripts .

node ../scripts/helpers/packageJsonScripts \
  package.json \
  start "node ../bin/index.js start" \
  lorem "node ../bin/index.js lorem"

npm start
npm run lorem

cd ..
rm -rf __test
