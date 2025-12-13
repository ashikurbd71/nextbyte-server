"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://nextbyteitinstitute.com',
    'https://www.nextbyteitinstitute.com',
    'https://admin.nextbyteitinstitute.com',
    'https://nextbyteit.vercel.app',
];
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn'],
        });
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin) {
                    return callback(null, true);
                }
                if (ALLOWED_ORIGINS.includes(origin)) {
                    return callback(null, true);
                }
                if (origin.endsWith('.vercel.app')) {
                    return callback(null, true);
                }
                console.error(`CORS: Origin ${origin} rejected.`);
                callback(new Error(`Origin ${origin} not allowed by CORS`), false);
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
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