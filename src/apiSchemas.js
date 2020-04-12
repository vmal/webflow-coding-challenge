/**
 * This file contains the JSON Schema definitions for the
 * request and response body JSON data.
 * Please ensure that your implementation conforms to this,
 * so that we can run an automated test suite against it.
 */
export const requestBody = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      description: 'The URL to scrape for fonts',
      minLength: 1,
    },
    crawlRelative: {
      enum: [false, 'breadth-first', 'depth-first'],
      description: `If 'breadth-first' or 'depth-first', the scraper should
        recursively scrape fonts from all linked pages, for all links that
        are relative to the current document.
        
        The order of scraping should be breadth first for 'breadth-first' and
        depth-first for 'depth-first'.
        
        If omitted or false, only the starting URL should be scraped.`
    },
    pageLimit: {
      type: 'integer',
      description: `The maximum number of pages to scrape for fonts.
        Only useful when crawlRelative is true. If not specified,
        should default to 1.`,
      minimum: 1,
    },
  }
};

export const responseBody = {
  oneOf: [
    {
      type: 'object',
      description: 'Response payload for a successful scrape',
      required: ['ok', 'fontFamilies'],
      properties: {
        ok: { const: true },
        fontFamilies: {
          anyOf: [
            {
              type: 'array',
              description: `
                An array of font family names. No specific ordering is required.
                Use this variant if you DON'T implement character counting.`,
              items: {
                type: 'string',
                description: 'Font family name'
              },
            },
            {
              type: 'array',
              description: `An array of objects with a font family name and
                the associated character count. No specific ordering is required.
                Use this variant if you DO implement character counting.`,
              items: {
                type: 'object',
                required: ['name', 'characterCount'],
                additionalProperties: false,
                properties: {
                  name: {
                    type: 'string',
                    description: 'Font family name',
                  },
                  characterCount: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Number of non-whitespace characters in ' +
                      'the document with this font family',
                  },
                }
              },
            },
          ]
        }
      },
    },
    {
      type: 'object',
      description: 'Response payload for a failed scrape',
      required: ['ok', 'reason'],
      properties: {
        ok: { const: false },
        reason: {
          type: 'string',
          minLength: 1,
          description: 'A freeform string describing the reason for failure.'
        },
      },
    }
  ]
};
