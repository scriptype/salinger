mkdir salinger-test
cd salinger-test

npm init -y
npm i -D salinger

cp ..\scripts\files\run . -recurse

node ..\scripts\helpers\package_json_scripts \
  package.json \
  start "salinger start" \
  lorem "salinger lorem"

npm start
npm run lorem
