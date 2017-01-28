node $BIN/html-minifier \
  --collapse-whitespace \
  --remove-attribute-quotes \
  --remove-comments \
  --remove-empty-attributes \
  --remove-redundant-attributes \
  --output $DIST/tmp.index.html \
  $HTML_OUTPUT

mv $DIST/tmp.index.html $HTML_OUTPUT
