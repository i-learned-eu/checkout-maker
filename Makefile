all: clean build

build:
	mkdir static/css
	sass --style compressed static/sass/styles.sass static/css/styles.min.css

clean:
	rm -r static/css/