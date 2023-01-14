SHELL=/bin/bash
POETRY := $(shell command -v poetry 2> /dev/null)
PYTHON := $(shell command -v python3 2> /dev/null)


.DEFAULT_GOAL := help

.PHONY: help
help:	## display this help message.
	@awk 'BEGIN {FS = ":.*##"; printf "Use make \033[36m<target>\033[0m where \033[36m<target>\033[0m is one of:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: dev
dev:	## install packages and prepare environment with poetry.
	@if [ -z $(POETRY) ]; then echo "Poetry could not be found. See https://python-poetry.org/docs/"; exit 2; fi
	@$(POETRY) install
	@$(POETRY) run pre-commit install
	@$(POETRY) shell

.PHONY: lint
lint:	## run the code linters with pre-commit.
	@$(POETRY) run pre-commit

.PHONY: serve
serve:	## serve page using simple HTTP server.
	@if [ -z $(PYTHON) ]; then echo "Python3 could not be found. See https://www.python.org/downloads/"; exit 2; fi
	@$(PYTHON) -m http.server -d docs
	@echo "Serving site at http://localhost:8000/"

.PHONY: scrape
scrape:	## scrape item prices from sbux.
	@$(POETRY) run python3 sbux_scraper/main.py
