"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTicketDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tickte_dto_1 = require("./create-tickte.dto");
class UpdateTicketDto extends (0, swagger_1.PartialType)(create_tickte_dto_1.CreateTicketDto) {
}
exports.UpdateTicketDto = UpdateTicketDto;
//# sourceMappingURL=update-tickte.dto.js.map