/* eslint-env node, jest */
/**
 * Test suite for the font scraper.
 * Feel free to change, improve and add more tests!
 */
import Ajv from 'ajv';
import fetch from 'isomorphic-fetch';
import util, {promisify} from 'util';
import serveFontScraper from '../src/server';
import * as apiSchemas from '../src/apiSchemas';

// ajv is a JSON Schema validator
const ajv = new Ajv({ allErrors: true });

const PORT = 3007;

let fontScraperServer;
beforeAll(async () => {
  fontScraperServer = await serveFontScraper({port: PORT});
});

afterAll(async () => {
  await promisify(
    fontScraperServer.close.bind(fontScraperServer)
  )();
});

async function parseFonts(url) {
  const requestData = { url };
  expect(requestData).toConformToSchema(apiSchemas.requestBody);
  const resp = await fetch(
    `http://localhost:${PORT}/parseFonts`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    }
  );
  return await resp.json();
}

describe("Public API conforms to specification", () => {
  test('Successful scrape response conforms to API specification', async () => {
    const data = await parseFonts('http://news.ycombinator.com');
    expect(data).toConformToSchema(apiSchemas.responseBody);
  });
  test('Failed scrape response conforms to API specification', async () => {
    const data = await parseFonts('http://example.com/this-will-404');
    expect(data).toConformToSchema(apiSchemas.responseBody);
  });
});

expect.extend({
  toConformToSchema(data, schema) {
    const valid = ajv.validate(schema, data);
    return {
      pass: valid,
      message: () => valid
        ? 'Data conformed to schema'
        : this.utils.matcherHint('toConformToSchema', 'data', 'schema') +
          '\n\nData did not conform to schema. Validation errors:\n' +
          util.inspect(ajv.errors, {depth: 5})
    };
  }
});
