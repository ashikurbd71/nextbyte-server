import { Strategy } from 'passport-jwt';
import { AdminService } from './admin.service';
declare const AdminJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private adminService;
    constructor(adminService: AdminService);
    validate(payload: any): Promise<{
        id: number;
        email: string;
        role: string;
    } | null>;
}
export {};
