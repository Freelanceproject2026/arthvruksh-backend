export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Arthvruksh API',
    version: '1.0.0',
    description: 'Backend API for Arthvruksh — user registration, login, and financial assessment.',
  },
  servers: [
    { url: '/api', description: 'API base' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    status: { type: 'string', example: 'running' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/UserPublic' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          409: { $ref: '#/components/responses/Conflict' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with mobile number',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mobile'],
                properties: {
                  mobile: { type: 'string', example: '9876543210' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User found',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessResponse' },
                    {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/UserPublic' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          404: { $ref: '#/components/responses/NotFound' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Fetch all registered users',
        description: 'Returns a list of all registered Arthvruksh users sorted by newest first.',
        responses: {
          200: {
            description: 'List of registered users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    count: {
                      type: 'integer',
                      example: 2,
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User'
                      }
                    }
                  }
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/InternalError'
          }
        }
      }
    },
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
          409: { $ref: '#/components/responses/Conflict' },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
      get: {
        tags: ['Assessment'],
        summary: 'Fetch all assessments',
        responses: {
          200: {
            description: 'List of all assessments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 5 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Assessment' },
                    },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/InternalError' },
        },
      },
    },
  },
  components: {
    schemas: {
      AuthInput: {
        type: 'object',
        required: ['fullName', 'email', 'mobile'],
        properties: {
          fullName: { type: 'string', example: 'Rahul Sharma' },
          email: { type: 'string', format: 'email', example: 'rahul@example.com' },
          mobile: { type: 'string', example: '9876543210' },
        },
      },
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
          fullName: { type: 'string', example: 'Rahul Sharma' },
          email: { type: 'string', example: 'rahul@example.com' },
          mobile: { type: 'string', example: '9876543210' },
          isVerified: { type: 'boolean', example: false },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1', },
          fullName: { type: 'string', example: 'Rahul Sharma', },
          email: { type: 'string', example: 'rahul@example.com', },
          mobile: { type: 'string', example: '9876543210', },
          isVerified: { type: 'boolean', example: false, },
          createdAt: { type: 'string', format: 'date-time', example: '2026-06-13T18:30:25.000Z', },
        },
      },
      AssessmentInput: {
        type: 'object',
        required: ['fullName', 'email', 'mobile'],
        properties: {
          fullName: { type: 'string', example: 'Rahul Sharma' },
          email: { type: 'string', format: 'email', example: 'rahul@example.com' },
          mobile: { type: 'string', example: '9876543210' },
          pan: { type: 'string', example: 'ABCDE1234F' },
          age: { type: 'integer', example: 32 },
          annualIncome: { type: 'number', example: 1200000 },
          savingsPercentage: { type: 'number', example: 20 },
          annualSavings: { type: 'number', example: 240000 },
          monthlySavings: { type: 'number', example: 20000 },
          q1EmergencyBuffer: { type: 'string', example: 'yes' },
          q2InvestmentTimeline: { type: 'string', example: '5-10 years' },
          q3CashFlowStability: { type: 'string', example: 'stable' },
          q4MarketDropReaction: { type: 'string', example: 'hold' },
          q5RiskAppetite: { type: 'string', example: 'moderate' },
          q6MFKnowledge: { type: 'string', example: 'basic' },
          totalScore: { type: 'integer', example: 18 },
          riskProfile: { type: 'string', example: 'Moderate' },
        },
      },
      Assessment: {
        allOf: [
          { $ref: '#/components/schemas/AssessmentInput' },
          {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation successful' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      Conflict: {
        description: 'Duplicate resource',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      InternalError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
};
