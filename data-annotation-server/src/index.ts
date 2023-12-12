import express from 'express';
import routes from './routes';
import { port } from './variables';
import cors from 'cors';

async function startServer() {
    const app = express();
    app.use(
        cors({
            origin: '*',
            credentials: true,
        }),
    );
    app.use(express.json());
    app.use(express.static('public'));
    app.use('/api', routes());
    //test
    await new Promise(resolve => app.listen({ port }, resolve as any));
    console.log(`🚀 Server ready at http://localhost:${port}`);
    return { app };
}

startServer();
