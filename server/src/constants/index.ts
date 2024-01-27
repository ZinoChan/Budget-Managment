export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

export const API_ROUTES = {
  BASE_URL: "/api/v1",
  USERS: "users",
  AUTH: "auth",
  LOGIN: "login",
  SIGN_UP: "signup",
  LOGOUT: "logout",
  VERIFY_EMAIL: "verifyemail",
  REFRESH_TOKEN: "refresh",
  FORGOT_PASSWORD: "forgotpassword",
  RESET_PASSWORD: "resetpassword",
  ENVELOPES: "envelopes",
  TRANSACTIONS: "transactions",
  STATS: "stats",
};
