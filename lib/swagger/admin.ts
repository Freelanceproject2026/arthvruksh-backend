const adminPaths = {
  '/admin/login': {
    post: {
      tags: ['Admin'],
      summary: 'Admin login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'admin@example.com' },
                password: { type: 'string', example: 'supersecret' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Admin login successful',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      admin: { $ref: '#/components/schemas/Admin' },
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
  '/admin/logout': {
    post: {
      tags: ['Admin'],
      summary: 'Admin logout',
      security: [{ AdminSession: [] }],
      responses: {
        200: {
          description: 'Admin logout successful',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
  '/admin/me': {
    get: {
      tags: ['Admin'],
      summary: 'Get authenticated admin profile',
      security: [{ AdminSession: [] }],
      responses: {
        200: {
          description: 'Authenticated admin profile',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      admin: { $ref: '#/components/schemas/Admin' },
                    },
                  },
                ],
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
  },
};

export { adminPaths };
