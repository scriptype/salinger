node $BIN/handlebars $HTML_INPUT -f $DIST/tmp.index.hbs.js

node -p " \
  var Handlebars = require('handlebars'); \
  var template = require('$DIST/tmp.index.hbs.js'); \
  Handlebars.templates['index.html']({ \
    SCRIPT_FILE: '$SCRIPT_FILE', \
    STYLE_FILE: '$STYLE_FILE', \
    LIVE_RELOAD: $LIVE_RELOAD \
  }) \
" > $HTML_OUTPUT

rm $DIST/tmp.index.hbs.js
