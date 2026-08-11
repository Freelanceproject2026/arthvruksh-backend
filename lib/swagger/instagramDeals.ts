const DEAL_SORT_NOTE =
  'Sort order: `featured` deals first, then by `displayOrder` ascending (lower number = higher priority), then `createdAt` descending as a tiebreaker.';

const FEATURED_LIMIT_NOTE =
  'At most 3 active deals (`MAX_FEATURED_DEALS`) can be featured at once. Setting `featured: true` on a 4th active deal returns 400 — unfeature another deal first.';

const instagramDealsPaths = {
  '/admin/instagram-deals': {
    post: {
      tags: ['Instagram Deals'],
      summary: 'Create an Instagram deal',
      description:
        'Admin pastes an Instagram post/reel URL copied from Instagram. The backend validates the URL, extracts the post id, and stores the deal.\n\n' +
        '**Accepted URL formats:**\n' +
        '- `https://www.instagram.com/p/XXXXX/`\n' +
        '- `https://instagram.com/p/XXXXX/`\n' +
        '- `https://www.instagram.com/reel/XXXXX/`\n' +
        '- `https://instagram.com/reel/XXXXX/`\n' +
        '- `https://www.instagram.com/tv/XXXXX/`\n' +
        '- Any of the above without a trailing slash, or with a query string (e.g. `?utm_source=ig_web_copy_link`)\n\n' +
        '**Rejected:**\n' +
        '- `https://instagram.com` (no post path)\n' +
        '- `https://instagram.com/profile` (not a post/reel/tv path)\n' +
        '- `https://instagram.com/explore` (not a post/reel/tv path)\n' +
        '- Any malformed or non-Instagram URL\n\n' +
        FEATURED_LIMIT_NOTE,
      security: [{ AdminSession: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/InstagramDealInput' },
            examples: {
              postUrlWithWww: {
                summary: 'Post URL with www.',
                value: { instagramUrl: 'https://www.instagram.com/p/C1a2B3cD4eF/' },
              },
              postUrlWithoutWww: {
                summary: 'Post URL without www.',
                value: { instagramUrl: 'https://instagram.com/p/C1a2B3cD4eF/' },
              },
              reelUrlWithWww: {
                summary: 'Reel URL with www.',
                value: { instagramUrl: 'https://www.instagram.com/reel/C1a2B3cD4eF/' },
              },
              reelUrlWithoutWww: {
                summary: 'Reel URL without www.',
                value: { instagramUrl: 'https://instagram.com/reel/C1a2B3cD4eF/' },
              },
              tvUrl: {
                summary: 'IGTV URL',
                value: { instagramUrl: 'https://www.instagram.com/tv/C1a2B3cD4eF/' },
              },
              fullPayload: {
                summary: 'Full payload with optional fields',
                value: {
                  instagramUrl: 'https://www.instagram.com/p/C1a2B3cD4eF/',
                  title: 'Flat 20% off SIP setup fee',
                  description: 'Limited-time offer for new SIP investors this festive season.',
                  thumbnailUrl: 'https://example.com/thumbnails/deal-1.jpg',
                  displayOrder: 0,
                  featured: false,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Instagram deal created',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      deal: { $ref: '#/components/schemas/InstagramDeal' },
                    },
                  },
                ],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        409: { $ref: '#/components/responses/Conflict' },
        500: { $ref: '#/components/responses/InternalError' },
      },
    },
    get: {
      tags: ['Instagram Deals'],
      summary: 'List all Instagram deals (admin)',
      description:
        `Returns a paginated list of Instagram deals for admin management, including inactive (soft-deleted) deals. ${DEAL_SORT_NOTE}`,
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
          description: 'Matches against title, description, and instagramUrl',
          schema: { type: 'string', example: 'sip' },
        },
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['active', 'inactive'] },
        },
      ],
      responses: {
        200: {
          description: 'Paginated list of Instagram deals',
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
                      status: { type: 'string', nullable: true },
                    },
                  },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/InstagramDeal' },
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
  '/admin/instagram-deals/{id}': {
    get: {
      tags: ['Instagram Deals'],
      summary: 'Get a single Instagram deal (admin)',
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
          description: 'Instagram deal details',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      deal: { $ref: '#/components/schemas/InstagramDeal' },
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
    put: {
      tags: ['Instagram Deals'],
      summary: 'Update an Instagram deal',
      description:
        `Partial update — only the fields present in the body are changed. Also used to set \`displayOrder\` or \`featured\` for manual homepage curation. ${FEATURED_LIMIT_NOTE}`,
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
            schema: { $ref: '#/components/schemas/InstagramDealUpdateInput' },
            examples: {
              pinToTop: {
                summary: 'Pin this deal above all others',
                value: { featured: true },
              },
              reorder: {
                summary: 'Move this deal to priority position 1',
                value: { displayOrder: 1 },
              },
              unfeature: {
                summary: 'Unpin a previously featured deal',
                value: { featured: false },
              },
              deactivate: {
                summary: 'Deactivate without deleting',
                value: { status: 'inactive' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Instagram deal updated',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      deal: { $ref: '#/components/schemas/InstagramDeal' },
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
      tags: ['Instagram Deals'],
      summary: 'Delete an Instagram deal (soft delete)',
      description: 'Soft deletes the deal by setting its status to "inactive". The document is not removed.',
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
          description: 'Instagram deal deleted successfully',
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
  '/instagram-deals': {
    get: {
      tags: ['Instagram Deals'],
      summary: 'Get latest Instagram deals (public)',
      description:
        `Returns a paginated list of active Instagram deals. Used by the homepage and mobile app. No authentication required. ${DEAL_SORT_NOTE}`,
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 12 },
        },
      ],
      responses: {
        200: {
          description: 'Paginated list of active Instagram deals',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  pagination: { $ref: '#/components/schemas/PublicPagination' },
                  deals: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/InstagramDealPublic' },
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
  '/instagram-deals/homepage': {
    get: {
      tags: ['Instagram Deals'],
      summary: 'Get homepage Instagram deals summary (public)',
      description:
        'Single combined call for the homepage: the total active deal count plus the latest 12 active deals. ' +
        `Avoids the frontend having to call \`/instagram-deals\` and \`/instagram-deals/count\` separately. ${DEAL_SORT_NOTE}`,
      responses: {
        200: {
          description: 'Homepage Instagram deals summary',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  count: { type: 'integer', example: 57 },
                  latestDeals: {
                    type: 'array',
                    maxItems: 12,
                    items: { $ref: '#/components/schemas/InstagramDealHomepage' },
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
  '/instagram-deals/count': {
    get: {
      tags: ['Instagram Deals'],
      summary: 'Get total active Instagram deal count (public)',
      description: 'Returns the total count of active Instagram deals, e.g. for a "57 Active Deals" homepage banner.',
      responses: {
        200: {
          description: 'Total active Instagram deal count',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      count: { type: 'integer', example: 57 },
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
  },
  '/instagram-deals/{id}': {
    get: {
      tags: ['Instagram Deals'],
      summary: 'Get a single active Instagram deal (public)',
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
          description: 'Instagram deal details',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SuccessResponse' },
                  {
                    type: 'object',
                    properties: {
                      deal: { $ref: '#/components/schemas/InstagramDealPublic' },
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
};

export { instagramDealsPaths };
