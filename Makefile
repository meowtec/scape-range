build:
	@node ./dev-utils/string.js ./src/scape.htm
	@browserify ./src/scape.js > ./scape.js
	@uglifyjs ./scape.js -m -o ./scape.min.js

	@lessc theme/style.less > theme/style.css