git clone https://github.com/scriptype/sh-task-wrapper.git __temp_clone__
cp -R __temp_clone__/run run
node -e "\
  var fs = require('fs'); \
  var srcPackage = require('./__temp_clone__/package.json'); \
  var devDependencies = srcPackage.devDependencies; \
  var scripts = srcPackage.scripts; \
  var targetPackage = require('./package.json'); \
  var newPackage = Object.assign({}, targetPackage, { \
    scripts, \
    devDependencies \
  }); \
  fs.writeFileSync('package.json', JSON.stringify(newPackage, null, 2)); \
" && \
rm -rf __temp_clone__ && \
npm i
