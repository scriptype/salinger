postcss \
  --use autoprefixer \
  --use postcss-import \
  --local-plugins \
  --output $DIST/tmp.style.css \
  $CSS_INPUT_PATH

cssnano $DIST/tmp.style.css $CSS_MIN_PATH
rm $DIST/tmp.style.css
