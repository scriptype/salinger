uglifyjs $JS_OUTPUT_PATH \
  --mangle \
  --compress \
  --output $JS_MIN_PATH

rm $JS_OUTPUT_PATH
