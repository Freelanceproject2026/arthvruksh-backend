export const schemas = {
  HealthStatus: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      status: { type: 'string', example: 'running' },
    },
  },
  AuthInput: {
    type: 'object',
    required: ['fullName', 'email', 'mobile'],
    properties: {
      fullName: { type: 'string', example: 'Rahul Sharma' },
      email: { type: 'string', format: 'email', example: 'rahul@example.com' },
      mobile: { type: 'string', example: '9876543210' },
    },
  },
  LoginInput: {
    type: 'object',
    required: ['mobile'],
    properties: {
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
      _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
      fullName: { type: 'string', example: 'Rahul Sharma' },
      email: { type: 'string', example: 'rahul@example.com' },
      mobile: { type: 'string', example: '9876543210' },
      isVerified: { type: 'boolean', example: false },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2026-06-13T18:30:25.000Z',
      },
      lastLogin: {
        type: 'string',
        format: 'date-time',
        example: '2026-06-14T10:15:00.000Z',
      },
    },
  },
  Admin: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
      fullName: { type: 'string', example: 'Admin User' },
      email: { type: 'string', example: 'admin@example.com' },
      role: { type: 'string', example: 'super_admin' },
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
          userId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
        },
      },
    ],
  },
  Dashboard: {
    type: 'object',
    properties: {
      generatedAt: { type: 'string', format: 'date-time' },
      stats: {
        type: 'object',
        properties: {
          users: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 128 },
              verified: { type: 'integer', example: 112 },
              unverified: { type: 'integer', example: 16 },
              newToday: { type: 'integer', example: 5 },
              newThisWeek: { type: 'integer', example: 17 },
              newThisMonth: { type: 'integer', example: 41 },
            },
          },
          assessments: {
            type: 'object',
            properties: {
              total: { type: 'integer', example: 84 },
              completedToday: { type: 'integer', example: 3 },
              completedThisWeek: { type: 'integer', example: 12 },
            },
          },
          riskProfiles: {
            type: 'object',
            properties: {
              low: { type: 'integer', example: 22 },
              moderate: { type: 'integer', example: 48 },
              high: { type: 'integer', example: 14 },
            },
          },
        },
      },
    },
  },
  AdminLog: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
      adminName: { type: 'string', example: 'Admin User' },
      adminEmail: { type: 'string', example: 'admin@example.com' },
      action: { type: 'string', example: 'LOGIN' },
      resource: { type: 'string', example: 'USER' },
      details: { type: 'object', example: { message: 'Viewed user profile' } },
      createdAt: { type: 'string', format: 'date-time' },
    },
  },
  Pagination: {
    type: 'object',
    properties: {
      page: { type: 'integer', example: 1 },
      limit: { type: 'integer', example: 20 },
      count: { type: 'integer', example: 20 },
      totalPages: { type: 'integer', example: 5 },
      totalRecords: { type: 'integer', example: 93 },
    },
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
};
