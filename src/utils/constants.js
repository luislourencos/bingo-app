
const env = process.env.NODE_ENV || 'development';


export const URL = env === 'development'?'http://localhost:2000':'https://supermarkets-bingo.onrender.com';