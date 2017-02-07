git clone https://github.com/scriptype/salinger-npm.git salinger

mkdir salinger-test
cd salinger-test

npm init -y
npm i -D salinger

cp -R ../salinger/scripts/files/run .

node ../salinger/scripts/helpers/package_json_scripts \
  package.json \
  start "salinger start" \
  lorem "salinger lorem"

npm start
npm run lorem
