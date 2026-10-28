const siteConfigPaths = {
  '/sip-book': {
    get: {
      tags: ['Site Config'],
      summary: 'Get the global SIP Book figure shown on the homepage',
      responses: {
        200: {
          description: 'Current SIP Book figure',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      sipBook: { type: 'number', example: 10000 },
                      sipBookLabel: { type: 'string', example: 'SIP Book' },
                      sipBookVisible: { type: 'boolean', example: true },
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
      summary: 'Update the SIP Book value, label and/or visibility',
      description:
        'All fields are optional; send only the ones you want to change.',
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                sipBook: { type: 'number', example: 761000 },
                sipBookLabel: { type: 'string', example: 'SIP Book' },
                sipBookVisible: { type: 'boolean', example: true },
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
                      sipBook: { type: 'number', example: 761000 },
                      sipBookLabel: { type: 'string', example: 'SIP Book' },
                      sipBookVisible: { type: 'boolean', example: true },
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
      summary: 'Get the global AUM figure shown on the homepage',
      responses: {
        200: {
          description: 'Current AUM figure',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      aum: { type: 'number', nullable: true, example: 22400000 },
                      aumLabel: { type: 'string', example: 'AUM (Annualized)' },
                      aumVisible: { type: 'boolean', example: true },
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
      summary: 'Update the AUM value, label and/or visibility',
      description:
        'All fields are optional; send only the ones you want to change.',
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                aum: { type: 'number', nullable: true, example: 22400000 },
                aumLabel: { type: 'string', example: 'AUM (Annualized)' },
                aumVisible: { type: 'boolean', example: true },
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
                      aum: { type: 'number', nullable: true, example: 22400000 },
                      aumLabel: { type: 'string', example: 'AUM (Annualized)' },
                      aumVisible: { type: 'boolean', example: true },
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
  '/announcement': {
    get: {
      tags: ['Site Config'],
      summary: 'Get the top-of-page announcement/milestone bar',
      responses: {
        200: {
          description: 'Current announcement bar content',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      announcement: { $ref: '#/components/schemas/Announcement' },
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
      summary: 'Update the announcement bar content and/or visibility',
      description:
        'All fields are optional; send only the ones you want to change. Set `enabled: false` to hide the bar entirely.',
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AnnouncementInput' },
          },
        },
      },
      responses: {
        200: {
          description: 'Announcement updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      announcement: { $ref: '#/components/schemas/Announcement' },
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
