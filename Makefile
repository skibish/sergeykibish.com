# A Self-Documenting Makefile: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html

.PHONY: build deploy
.DEFAULT_GOAL := help

include .env
export $(shell sed 's/=.*//' .env)

build: ## Build webiste
	docker run --rm -v `pwd`:/app -w /app --entrypoint "npm" node:9.11-alpine install
	docker run --rm -v `pwd`:/app -w /app --entrypoint "npm" node:9.11-alpine run build
	hugo

deploy: ## Deploy website
	docker run --rm -v `pwd`:/app -w /app node:9.11-alpine node ./node_modules/.bin/firebase deploy --token "${FIREBASE_TOKEN}"

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
