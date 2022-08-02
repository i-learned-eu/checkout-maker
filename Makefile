all: clean build

build:
	curl https://cdn.ilearned.eu/css/base.min.css > static/sass/base.css
	mkdir static/css
	sass --style compressed static/sass/styles.sass static/css/styles.min.css

clean:
	rm -r static/css/