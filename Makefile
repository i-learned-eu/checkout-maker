all: clean build

build:
	curl https://gitlab.ilearned.eu/i-learned/design-system/-/raw/main/sass/_fonts.sass > static/sass/_fontsCdn.sass
	mkdir static/css
	sass --style compressed static/sass/styles.sass static/css/styles.min.css

clean:
	rm -r static/css/