import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(__dirname, '../../.env');
if (fs.existsSync(ENV_PATH)) {
    const result = dotenv.config({ path: ENV_PATH });
    if (result.error) {
        throw result.error;
    }
    console.log('Using .env file to supply config environment variables');
} else {
    console.log('No .env file found, exiting...');
    process.exit(1);
}

const port = process.env.PORT;
const appSecret = process.env['APP_SECRET'] || '';
export { port, appSecret };
