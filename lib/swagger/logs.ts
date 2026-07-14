const logsPaths = {
  '/admin/logs': {
    get: {
      tags: ['Logs'],
      summary: 'Get admin activity logs',
      security: [{ AdminSession: [] }],
      responses: {
        200: {
          description: 'List of admin activity logs',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/AdminLog' },
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
};

export { logsPaths };
