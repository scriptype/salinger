node $BIN/watchify \
  --delay=100 \
  --verbose \
  --transform [ babelify --presets [ es2015 react ] ] \
  --outfile $JS_OUTPUT \
  --debug \
  $JS_INPUT
