"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
let cachedHandler;
async function bootstrapHandler() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['error', 'warn'] });
    await app.init();
    const expressInstance = app.getHttpAdapter().getInstance();
    return expressInstance;
}
module.exports = async (req, res) => {
    if (!cachedHandler) {
        cachedHandler = await bootstrapHandler();
    }
    return cachedHandler(req, res);
};
//# sourceMappingURL=index.js.map