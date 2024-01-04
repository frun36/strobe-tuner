build:
	wasm-pack build --target web

run:
	wasm-pack build --target web
	python -m http.server