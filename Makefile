build:
	@rm -rf dist
	@mkdir dist
	@node ./dev-utils/string.js ./src/scape.htm
	@browserify ./src/scape.js > ./dist/scape.js
	@uglifyjs ./src/scape.js -m -o ./dist/scape.min.js

	@lessc ./less/style.less > ./dist/scape.css
	@rm -rf ./src/scape.htm.js
