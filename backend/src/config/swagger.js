export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Car Brand Kilometer Tracking API',
    description: 'API for admins to manage car brands and users to track kilometers per brand.',
    version: '1.0.0',
  },
  servers: [
    { url: 'http://localhost:8000', description: 'Development' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          name: { type: 'string', example: 'John Doe' },
          role: { type: 'string', enum: ['ADMIN', 'USER'] },
        },
      },
      CarBrand: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          name: { type: 'string', example: 'Toyota' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      KilometerEntry: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          brand: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' } } },
          kilometers: { type: 'number', minimum: 0 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TotalByBrand: {
        type: 'object',
        properties: {
          brandId: { type: 'string' },
          brandName: { type: 'string' },
          totalKilometers: { type: 'number' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', minLength: 6, example: 'secret123' },
                  name: { type: 'string', example: 'John Doe' },
                  role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', description: 'JWT' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or email already exists',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    token: { type: 'string', description: 'JWT' },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Get current user',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    user: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: {
            description: 'Not authorized',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
    },
    '/api/brands': {
      get: {
        summary: 'List all car brands',
        description: 'Requires authentication. Available to both ADMIN and USER.',
        tags: ['Brands'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of brands',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/CarBrand' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Not authorized',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
        },
      },
      post: {
        summary: 'Create a car brand',
        description: 'Admin only.',
        tags: ['Brands'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Toyota' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Brand created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CarBrand' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or duplicate name',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
          401: { description: 'Not authorized' },
          403: { description: 'Admin only' },
        },
      },
    },
    '/api/brands/{id}': {
      get: {
        summary: 'Get a brand by ID',
        tags: ['Brands'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Brand',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CarBrand' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Brand not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
          401: { description: 'Not authorized' },
        },
      },
      delete: {
        summary: 'Delete a brand',
        description: 'Admin only.',
        tags: ['Brands'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Brand deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          404: { description: 'Brand not found' },
          401: { description: 'Not authorized' },
          403: { description: 'Admin only' },
        },
      },
    },
    '/api/kilometers': {
      get: {
        summary: 'Get my kilometer entries',
        description: 'USER role only. Returns all entries for the current user.',
        tags: ['Kilometers'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/KilometerEntry' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Not authorized' },
          403: { description: 'USER role only' },
        },
      },
      post: {
        summary: 'Add kilometers for a brand',
        description: 'USER role only.',
        tags: ['Kilometers'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['brandId', 'kilometers'],
                properties: {
                  brandId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  kilometers: { type: 'number', minimum: 0, example: 150 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Entry created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/KilometerEntry' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Error' } },
            },
          },
          404: { description: 'Brand not found' },
          401: { description: 'Not authorized' },
          403: { description: 'USER role only' },
        },
      },
    },
    '/api/kilometers/totals': {
      get: {
        summary: 'Get total kilometers per brand',
        description: 'USER role only. Aggregated totals for the current user.',
        tags: ['Kilometers'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Totals by brand',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/TotalByBrand' },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Not authorized' },
          403: { description: 'USER role only' },
        },
      },
    },
  },
};
