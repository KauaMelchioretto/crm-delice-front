import {
    Module,
    ModuleDeleteResponse,
    ModuleListResponse,
    ModuleResponse,
    ModuleWithRolesResponse, Role, RoleByModuleResponse, RoleDeleteResponse, RoleResponse,
} from "../enitites/entities.ts";
import {modulesRepository} from "../repository/ModulesRepository.ts";

class ModulesUseCase {
    CODE_MUST_BE_PROVIDED = "The code must be provided"
    LABEL_MUST_BE_PROVIDED = "The label must be provided"
    PATH_MUST_BE_PROVIDED = "The path must be provided"

    async createModule(module: Module): Promise<ModuleResponse> {
        if (!module.code) {
            return {error: this.CODE_MUST_BE_PROVIDED}
        }
        if (!module.label) {
            return {error: this.LABEL_MUST_BE_PROVIDED}
        }
        if (!module.path) {
            return {error: this.PATH_MUST_BE_PROVIDED}
        }

        return modulesRepository.createModule(module)
    }

    async getModules(): Promise<ModuleListResponse> {
        return modulesRepository.getModules()
    }

    async getModuleByUUID(moduleUUID: string): Promise<ModuleResponse> {
        return modulesRepository.getModuleByUUID(moduleUUID)
    }

    async deleteModuleByUUID(moduleUUID: string): Promise<ModuleDeleteResponse> {
        return modulesRepository.deleteModuleByUUID(moduleUUID)
    }

    async getModuleWithRoles(moduleUUID: string): Promise<ModuleWithRolesResponse> {
        return modulesRepository.getModuleWithRoles(moduleUUID)
    }

    async registerRole(role: Role): Promise<RoleResponse> {
        if (!role.code) {
            return {error: this.CODE_MUST_BE_PROVIDED}
        }
        if (!role.label) {
            return {error: this.LABEL_MUST_BE_PROVIDED}
        }

        return modulesRepository.registerRole(role)
    }

    async deleteRoleByUUID(roleUUID: string): Promise<RoleDeleteResponse> {
        return modulesRepository.deleteRoleByUUID(roleUUID)
    }

    async getAllRoles(): Promise<RoleByModuleResponse> {
        return modulesRepository.getAllRoles()
    }
}

export const modulesUseCase = new ModulesUseCase();