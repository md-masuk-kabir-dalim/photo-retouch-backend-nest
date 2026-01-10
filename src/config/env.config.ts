/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

require('dotenv').config({ path: './.env' });

export const envConfig = {
  port: parseInt(process.env.PORT, 10) || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/photo-retouch',
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
  },
  aws: {
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    aws_region: process.env.AWS_REGION,
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
    AWS_ENDPOINT: process.env.AWS_ENDPOINT,
  },
  pusher: {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  },
  url: {
    skin_bg_base_api: process.env.SKIN_BG_BASE_API,
    makeup_base_api: process.env.MAKEUP_BASE_API,
  },
};
