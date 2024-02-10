build:
	wasm-pack build wasm --target web --out-dir ./pkg
	npm run build

run:
	wasm-pack build wasm --target web --out-dir ./pkg
	npm run build
	npm run preview

dev:
	wasm-pack build wasm --target web --out-dir ./pkg
	npm run dev