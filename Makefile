build:
	wasm-pack build wasm --target web --out-dir ../app/pkg

run:
	wasm-pack build wasm --target web --out-dir ../app/pkg
	python -m http.server --directory app