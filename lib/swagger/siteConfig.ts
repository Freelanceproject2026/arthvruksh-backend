const siteConfigPaths = {
  '/sip-book': {
    get: {
      tags: ['Site Config'],
      summary: 'Get the global SIP Book value',
      responses: {
        200: {
          description: 'Current SIP Book value',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      sipBook: { type: 'number', example: 10000 },
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
    patch: {
      tags: ['Site Config'],
      summary: 'Update the global SIP Book value',
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['sipBook'],
              properties: {
                sipBook: { type: 'number', example: 25000000 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'SIP Book updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      sipBook: { type: 'number', example: 25000000 },
                    },
                  },
                ],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/aum': {
    get: {
      tags: ['Site Config'],
      summary: 'Get the global AUM value',
      responses: {
        200: {
          description: 'Current AUM value',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      aum: {
                        type: 'number',
                        nullable: true,
                        example: null,
                      },
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
    patch: {
      tags: ['Site Config'],
      summary: 'Update the global AUM value',
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['aum'],
              properties: {
                aum: {
                  type: 'number',
                  nullable: true,
                  example: 450000000,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'AUM updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      aum: {
                        type: 'number',
                        nullable: true,
                        example: 450000000,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export { siteConfigPaths };
