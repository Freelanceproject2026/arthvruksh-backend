const visitorsPaths = {
  '/visitors': {
    get: {
      tags: ['Visitors'],
      summary: 'Get the total visitor count and register the current session',
      description:
        'Returns the all-time visitor count. If the caller has no visitor session cookie yet, the count is incremented once and the cookie is set for the remainder of the browser session.',
      responses: {
        200: {
          description: 'Current visitor count',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      count: { type: 'number', example: 1024 },
                    },
                  },
                ],
              },
            },
          },
        },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export { visitorsPaths };
