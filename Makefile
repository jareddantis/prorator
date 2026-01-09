.PHONY: install lint dev test build

install:
	npm install

lint:
	npm run format

dev:
	npm run dev

test:
	npm run test

build:
	npm run build
