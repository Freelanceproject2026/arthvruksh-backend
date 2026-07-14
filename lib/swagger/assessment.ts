const assessmentPaths = {
  '/assessment': {
    post: {
      tags: ['Assessment'],
      summary: 'Submit a user assessment',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AssessmentInput' },
          },
        },
      },
      responses: {
        201: {
          description: 'Assessment saved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    get: {
      tags: ['Assessment'],
      summary: 'Fetch assessments',
      description: 'Returns a paginated list of assessments with optional search and risk filters.',
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
          name: 'risk',
          in: 'query',
          schema: { type: 'string', enum: ['Low', 'Moderate', 'High'] },
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
          description: 'List of assessments',
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
                      risk: { type: 'string' },
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
                    items: { $ref: '#/components/schemas/Assessment' },
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

export { assessmentPaths };
