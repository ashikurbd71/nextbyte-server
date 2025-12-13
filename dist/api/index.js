"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const BASE_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://nextbyteitinstitute.com',
    'https://www.nextbyteitinstitute.com',
    'https://admin.nextbyteitinstitute.com',
    'https://nextbyteit.vercel.app',
];
const ADDITIONAL_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
    : [];
const ALLOWED_ORIGINS = [...BASE_ALLOWED_ORIGINS, ...ADDITIONAL_ORIGINS];
let cachedHandler;
async function bootstrapHandler() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['error', 'warn'] });
    app.enableCors({
        origin: (origin, callback) => {
            console.log(`[CORS] Checking origin: ${origin || 'null/undefined'}`);
            if (!origin) {
                console.log('[CORS] No origin provided, allowing request');
                return callback(null, true);
            }
            const normalized = origin.replace(/\/$/, '');
            const isAllowed = ALLOWED_ORIGINS.includes(origin) ||
                ALLOWED_ORIGINS.includes(normalized) ||
                origin.endsWith('.vercel.app');
            if (isAllowed) {
                console.log(`[CORS] Origin ${origin} is allowed`);
                return callback(null, true);
            }
            console.error(`[CORS] Origin ${origin} rejected. Allowed origins:`, ALLOWED_ORIGINS);
            callback(new Error(`Origin ${origin} not allowed by CORS`), false);
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    await app.init();
    return app.getHttpAdapter().getInstance();
}
function getRequestOrigin(req) {
    let origin = req.headers.origin;
    if (!origin && req.headers.referer) {
        try {
            origin = new URL(req.headers.referer).origin;
        }
        catch { }
    }
    return origin;
}
function isOriginAllowed(origin) {
    if (!origin)
        return true;
    const normalized = origin.replace(/\/$/, '');
    return ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes(normalized) || origin.endsWith('.vercel.app');
}
function setCorsHeaders(req, res) {
    const origin = getRequestOrigin(req);
    console.log(`[CORS Headers] Setting headers for origin: ${origin || 'null'}`);
    if (isOriginAllowed(origin)) {
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            console.log(`[CORS Headers] Set origin to: ${origin} with credentials`);
        }
        else {
            const fallbackOrigin = ALLOWED_ORIGINS[0] || '*';
            res.setHeader('Access-Control-Allow-Origin', fallbackOrigin);
            console.log(`[CORS Headers] No origin, using fallback: ${fallbackOrigin}`);
        }
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin,X-Requested-With');
        res.setHeader('Access-Control-Max-Age', '86400');
    }
    else {
        console.error(`[CORS Headers] Origin ${origin} is not allowed`);
    }
}
exports.default = async (req, res) => {
    setCorsHeaders(req, res);
    if (req.method === 'OPTIONS') {
        const origin = getRequestOrigin(req);
        if (isOriginAllowed(origin)) {
            console.log(`[OPTIONS] Preflight request allowed for origin: ${origin}`);
            return res.status(204).end();
        }
        else {
            console.error(`[OPTIONS] Preflight request rejected for origin: ${origin}`);
            return res.status(403).json({ error: 'CORS policy violation' });
        }
    }
    if (!cachedHandler) {
        console.log('[Handler] Initializing NestJS handler...');
        cachedHandler = await bootstrapHandler();
    }
    const originalWriteHead = res.writeHead.bind(res);
    res.writeHead = function (statusCode, statusMessage, headers) {
        setCorsHeaders(req, res);
        if (typeof statusMessage === 'object') {
            headers = statusMessage;
            statusMessage = undefined;
        }
        return originalWriteHead(statusCode, statusMessage, headers);
    };
    const originalEnd = res.end.bind(res);
    res.end = function (chunk, encoding, cb) {
        setCorsHeaders(req, res);
        return originalEnd(chunk, encoding, cb);
    };
    return cachedHandler(req, res);
};
//# sourceMappingURL=index.js.map