# Webflow Font-Family Scraper

Given a URL input, scrape the webpage to find all fonts used on the site.

## Project Overview

The repo contains a skeleton Node.js/express server to get you started quickly. The following files are central to the challenge:

- [`index.js`](src/index.js) is the entry point to the program and starts the server.
- [`server.js`](src/server.js) defines the server and its single `/parseFonts` endpoint
- [`server.test.js`](tests/server.test.js) includes a simple test suite
- [`apiSchemas.js`](src/apiSchemas.js) contains the JSON schemas for both the request body and the response body payloads that the `/parseFonts` endpoint should accept and conform to.

## Challenge Specification

Implement the `POST /parseFonts` endpoint. The endpoint takes a URL as an input and should return a list of all font families used on that page.

At minimum, fonts defined in the following locations should be returned:

- Font families declared in HTML element `style` attribute values
- Font families declared in CSS stylesheets, inline with `<style>` or external

The scraper must also support an optional parameter called `crawlRelative` to perform breadth-first or depth-first crawling of relatively linked pages. The response should include all font families seen on the set of crawled pages.

Additionally, to limit the work done when `crawlRelative` is enabled, the implementation must support a `pageLimit` parameter that sets the maximum number of pages to crawl.

You may use third party libraries in your implementation.

### Stretch Goals

For a junior position, any stretch goals you implement with satisfactory quality will have a positive effect on our evaluation but is not required to pass the evaluation if you provide a high-quality submission with only the required features. Those seeking a senior position should attempt the stretch goals, in addition to the required ones.

- :dart: Instead of returning an array of font-family names, return an array of objects like `{ name: 'sans-serif', characterCount: 1234 }`, where the `characterCount` is the amount of non-whitespace characters that appear in the document with that font-family. If an element lists multiple font families (e.g.: `font-family: Georgia, serif;`), attribute the character count to all the listed font families. 
- :dart: Write tests
- :dart: Add an endpoint that crawls the 100 most popular sites on the [Webflow Discover](webflow.com/discover/popular) section. You are free to define the specifics of this endpoint. We will evaluate this part manually instead of using our automated checker.
- :dart: Add Flow typing to the code. We evaluate your typing by its accuracy, but we don't expect full accuracy. In some cases, such as when dealing with some of Flow's limitations, it is better to be slightly inaccurate and reduce type verbosity.

:warning: **A more detailed specification of the input parameters and response data is included in the `description` properties of JSON schemas in [`apiSchemas`](src/apiSchemas.js)**

### Acceptance Criteria

We will be evaluating both subjective and objective criteria. Subjective criteria include how easy your code is to read, how well it is structured, and how well you communicate in discussions at the code review stage. We will also look at the PR description for a discussion of any tradeoffs made and limitations known. Objective criteria include any stretch goals implemented, having both your test suite and linter succeed, as well as a run through our automated checker to test how robust your implementation is. 

## Project Setup Instructions

First, clone the repository to your computer and `cd` into the repository folder, then follow the below instructions to run the server directly with Node or via Docker. If you run the server directly with Node, you have the benefit of server auto-reload working out of the box.

### Running directly on Node.js

1. Make sure you have Node and yarn installed. We recommmend Node 12+, but there shouldn't be any issues running Node 8+. We will evaluate your submission by running it inside a Docker container that uses Node 12.
1. Run `yarn install` to install dependencies.

To run the server:

```bash
yarn start
```

You can verify that the server is running correctly by making the following request with `curl` in another tab:

```bash
curl -d '{"url": "http://news.ycombinator.com"}' -H "Content-Type: application/json" -X POST http://localhost:3007/parseFonts
```

Additionally, the following yarn commands are available:

- `yarn run start:watch`: runs the server and restarts when source files change
- `yarn test`: runs the test suite
- `yarn test:watch`: runs the test suite and reruns tests when source files change
- `yarn run lint`: runs eslint
- `yarn run flow`: runs the Flow type checker

### Running via Docker

1. Ensure you have `make` and Docker installed.

To run the server:

```
make docker-start
```

You can verify that the server is running correctly by making the following request with `curl` in another tab:

```bash
curl -d '{"url": "http://news.ycombinator.com"}' -H "Content-Type: application/json" -X POST http://localhost:3007/parseFonts
```

Additionally, the following make commands are available:

- `make docker-test`: runs the test suite
- `make docker-lint`: runs eslint
- `make docker-flow`: runs the Flow type checker

## Before you submit

Run through the checklist below to make sure we can properly evaluate your submission:

- [ ] Run `make docker-start` to make sure the server is runnable via docker
- [ ] Run `make docker-test` to make sure tests pass via docker
- [ ] Run `make docker-lint` to ensure the linter shows no errors
- [ ] If you added Flow types, run `make docker-flow` to make sure Flow type checking passes
- [ ] Include any known limitations of your implementation in the PR description

Good luck! :sparkles: