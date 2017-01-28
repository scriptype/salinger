node $BIN/postcss \
  --use autoprefixer \
  --use postcss-import \
  --local-plugins \
  --output $DIST/tmp.style.css \
  $CSS_INPUT

node $BIN/cssnano $DIST/tmp.style.css $CSS_OUTPUT_MIN
rm $DIST/tmp.style.css
