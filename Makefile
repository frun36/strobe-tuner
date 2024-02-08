build:
	wasm-pack build wasm --target web --out-dir ../pkg
	npm run build

run:
	wasm-pack build wasm --target web --out-dir ../pkg
	npm run build
	python -m http.server --directory dist