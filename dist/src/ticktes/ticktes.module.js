"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicktesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ticktes_service_1 = require("./ticktes.service");
const ticktes_controller_1 = require("./ticktes.controller");
const tickte_entity_1 = require("./entities/tickte.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const user_entity_1 = require("../users/entities/user.entity");
const email_service_1 = require("../admin/email.service");
let TicktesModule = class TicktesModule {
};
exports.TicktesModule = TicktesModule;
exports.TicktesModule = TicktesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tickte_entity_1.Ticket, admin_entity_1.Admin, user_entity_1.User]),
        ],
        controllers: [ticktes_controller_1.TicktesController],
        providers: [ticktes_service_1.TicktesService, email_service_1.EmailService],
        exports: [ticktes_service_1.TicktesService],
    })
], TicktesModule);
//# sourceMappingURL=ticktes.module.js.map