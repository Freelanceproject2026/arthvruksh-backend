const usersPaths = {
  '/users': {
    get: {
      tags: ['Users'],
      summary: 'Fetch registered users',
      description: 'Returns a paginated list of users with optional search, verification, and sorting filters.',
      security: [{ AdminSession: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 20 },
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string', example: 'rahul' },
        },
        {
          name: 'verified',
          in: 'query',
          schema: { type: 'string', enum: ['true', 'false'] },
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', example: 'createdAt' },
        },
        {
          name: 'order',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], example: 'desc' },
        },
      ],
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  pagination: { $ref: '#/components/schemas/Pagination' },
                  filters: {
                    type: 'object',
                    properties: {
                      search: { type: 'string' },
                      verified: { type: 'string' },
                    },
                  },
                  sorting: {
                    type: 'object',
                    properties: {
                      sortBy: { type: 'string' },
                      order: { type: 'string' },
                    },
                  },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Fetch a single user',
      security: [{ AdminSession: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User details',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          assessment: { $ref: '#/components/schemas/Assessment' },
                          hasAssessment: { type: 'boolean', example: false },
                        },
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
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    patch: {
      tags: ['Users'],
      summary: 'Update a user',
      security: [{ AdminSession: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                fullName: { type: 'string', example: 'Rahul Sharma' },
                email: { type: 'string', format: 'email', example: 'rahul@example.com' },
                mobile: { type: 'string', example: '9876543210' },
                isVerified: { type: 'boolean', example: true },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      data: { $ref: '#/components/schemas/User' },
                    },
                  },
                ],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete a user',
      security: [{ AdminSession: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'User deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export { usersPaths };
