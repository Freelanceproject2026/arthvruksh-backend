import { schemas } from './schemas';
import { responses } from './responses';
import { authPaths } from './auth';
import { adminPaths } from './admin';
import { usersPaths } from './users';
import { assessmentPaths } from './assessment';
import { dashboardPaths } from './dashboard';
import { logsPaths } from './logs';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Arthvruksh API',
    version: '1.0.0',
    description: 'Professional API documentation for the Arthvruksh backend.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local Development',
    },
    {
      url: 'https://arthvruksh-backend-rho.vercel.app/api',
      description: 'Production',
    },
  ],
  tags: [
    { name: 'Authentication' },
    { name: 'Admin' },
    { name: 'Users' },
    { name: 'Assessment' },
    { name: 'Dashboard' },
    { name: 'Logs' },
  ],
  paths: {
    ...authPaths,
    ...adminPaths,
    ...usersPaths,
    ...assessmentPaths,
    ...dashboardPaths,
    ...logsPaths,
    '/health': {
      get: {
        tags: ['Authentication'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is running',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthStatus' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      AdminSession: {
        type: 'apiKey',
        in: 'cookie',
        name: 'admin-session',
      },
    },
    schemas,
    responses,
  },
};
