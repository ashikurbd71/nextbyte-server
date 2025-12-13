"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        app.enableCors({
            origin: (origin, callback) => {
                const allowedOrigins = [
                    'http://localhost:3000',
                    'https://nextbyteitinstitute.com',
                    'https://www.nextbyteitinstitute.com',
                    'https://admin.nextbyteitinstitute.com',
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}
if (!process.env.VERCEL) {
    async function startLocalServer() {
        const app = await bootstrap();
        const port = process.env.PORT || 5000;
        await app.listen(port);
        console.log(`🚀 Server is running on: http://localhost:${port}`);
    }
    startLocalServer();
}
async function handler(req, res) {
    const app = await bootstrap();
    app.getHttpAdapter().getInstance()(req, res);
}
//# sourceMappingURL=main.js.map