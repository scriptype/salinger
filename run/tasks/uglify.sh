node $BIN/uglifyjs $JS_OUTPUT \
  --mangle \
  --compress \
  --output $JS_OUTPUT_MIN

rm $JS_OUTPUT
