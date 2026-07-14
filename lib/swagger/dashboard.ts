const dashboardPaths = {
  '/admin/dashboard': {
    get: {
      tags: ['Dashboard'],
      summary: 'Get dashboard statistics',
      security: [{ AdminSession: [] }],
      responses: {
        200: {
          description: 'Dashboard statistics',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      generatedAt: { type: 'string', format: 'date-time' },
                      stats: { $ref: '#/components/schemas/Dashboard' },
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

export { dashboardPaths };
