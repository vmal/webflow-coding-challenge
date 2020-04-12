.PHONY: docker-build docker-start docker-test docker-lint docker-flow

docker-build:
	docker build -t wf-font-scraper-submission .

docker-start: docker-build
	docker run -it -p 3007:3007 --entrypoint "yarn" wf-font-scraper-submission start

docker-test: docker-build
	docker run -it --entrypoint "yarn" wf-font-scraper-submission test

docker-lint: docker-build
	docker run -it --entrypoint "yarn" wf-font-scraper-submission run lint

docker-flow: docker-build
	docker run -it --entrypoint "yarn" wf-font-scraper-submission run flow