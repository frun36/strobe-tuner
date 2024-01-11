build:
	wasm-pack build --target web --out-dir app/pkg

run:
	wasm-pack build --target web --out-dir app/pkg
	python -m http.server --directory app