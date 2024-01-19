import config from "config";
export default {
  openapi: "3.0.0",
  info: {
    title: "Kakeibo API Docs",
    version: "1.0.0",
    description: "API Description",
  },
  servers: [
    {
      url: config.get<string>("apiUrl"),
    },
  ],
  components: {
    schemas: {
      CreateUserInput: {
        type: "object",
        required: ["email", "name", "password", "passwordConfirmation"],
        properties: {
          email: {
            type: "string",
            default: "jane.doe@example.com",
          },
          name: {
            type: "string",
            default: "Jane Doe",
          },
          password: {
            type: "string",
            default: "stringPassword123",
          },
          passwordConfirmation: {
            type: "string",
            default: "stringPassword123",
          },
        },
      },
      VerifyEmailInput: {
        type: "object",
        parameters: [
          {
            in: "path",
            name: "verificationCode",
            description: "The verification code sent to the user's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
      },
      LoginUserInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            default: "jane.doe@example.com",
          },
          password: {
            type: "string",
            default: "stringPassword123",
          },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        summary: "Register a new user",
        description: "Register a new user with the provided information.",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserInput",
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "User successfully registered. Email verification sent.",
            content: {
              "application/json": {
                example: {
                  status: "success",
                  message:
                    "An email verification has been sent to user@example.com",
                },
              },
            },
          },
          409: {
            description: "Email already exists.",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Email already exists",
                },
              },
            },
          },
          422: {
            description:
              "Unprocessable Entity. Password and password confirmation do not match.",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Password and password confirmation do not match",
                },
              },
            },
          },
          500: {
            description: "Server error. Check the response for details.",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Internal server error occurred",
                },
              },
            },
          },
        },
      },
    },
    "/auth/verifyemail/${verificationCode}": {
      post: {
        summary: "Verify user email",
        description: "Verify user email with the provided verification code",
        tags: ["Auth"],
        parameters: [
          {
            in: "path",
            name: "verificationCode",
            description: "The verification code sent to the user's email",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "User email successfully verified",
            content: {
              "application/json": {
                example: {
                  status: "success",
                  message: "User email successfully verified",
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "User already verified",
                },
              },
            },
          },
          404: {
            description: "user not found",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Verification code not found",
                },
              },
            },
          },
          500: {
            description: "Internal server error occurred",
            content: {
              "application/json": {
                example: {
                  status: "error",
                  message: "Internal server error occurred",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "login a new user",
        description: "login to user account",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginUserInput",
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "User successfully logged in, The session ID is returned in a cookie named `access_token`. You need to include this cookie in subsequent requests.",
            content: {
              "application/json": {
                example: {
                  status: "success",
                  access_token: "access_token",
                },
              },
            },
            headers: {
              "Set-Cookie": {
                description: "Cookies set in the response for authentication.",
                schema: {
                  type: "string",
                  example:
                    "access_token=abcedef; refresh_token=abcdef; Path=/; HttpOnly",
                },
              },
            },
          },
          401: {
            description: "user email not verified",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message:
                    "You are not verified, please verify your email, link sent to janeDoe@example.com",
                },
              },
            },
          },
          403: {
            description: "invalid email or password",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "invalid email or password",
                },
              },
            },
          },
          500: {
            description: "Server error. Check the response for details.",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Internal server error occurred",
                },
              },
            },
          },
        },
      },
    },
    "/auth/refresh": {
      get: {
        summary: "refresh access token",
        description: "refresh expired access token",
        tags: ["Auth"],
        responses: {
          200: {
            description:
              "User successfully refresh token, The session ID is returned in a cookie named `access_token`",
            content: {
              "application/json": {
                example: {
                  status: "success",
                  access_token: "access_token",
                },
              },
            },
            headers: {
              "Set-Cookie": {
                description: "Cookies set in the response for authentication.",
                schema: {
                  type: "string",
                  example:
                    "access_token=abcedef; logged_in=true; Path=/; HttpOnly",
                },
              },
            },
          },
          403: {
            description: "could not refresh access token",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "could not refresh access token",
                },
              },
            },
          },
          500: {
            description: "Server error. Check the response for details.",
            content: {
              "application/json": {
                example: {
                  status: "fail",
                  message: "Internal server error occurred",
                },
              },
            },
          },
        },
      },
    },
  },
};
