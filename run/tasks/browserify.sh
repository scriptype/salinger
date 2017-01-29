node $BIN/browserify \
  --delay=100 \
  --verbose \
  --transform [ babelify --presets [ es2015 react ] ] \
  --outfile $JS_OUTPUT_PATH \
  --debug \
  $JS_INPUT_PATH
