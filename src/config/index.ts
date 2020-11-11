const JWT_SECRET = process.env.jwtSecret || `Super secret string`;
const {
  APP_PORT,
  POSTGRES_HOST,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_PORT,
} = process.env;


export {
  JWT_SECRET,
  APP_PORT,
  POSTGRES_HOST,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_PORT
}