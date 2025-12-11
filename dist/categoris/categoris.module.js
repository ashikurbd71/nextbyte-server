"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorisModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoris_service_1 = require("./categoris.service");
const categoris_controller_1 = require("./categoris.controller");
const categoris_entity_1 = require("./entities/categoris.entity");
let CategorisModule = class CategorisModule {
};
exports.CategorisModule = CategorisModule;
exports.CategorisModule = CategorisModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoris_entity_1.Category])],
        controllers: [categoris_controller_1.CategorisController],
        providers: [categoris_service_1.CategorisService],
        exports: [categoris_service_1.CategorisService],
    })
], CategorisModule);
//# sourceMappingURL=categoris.module.js.map