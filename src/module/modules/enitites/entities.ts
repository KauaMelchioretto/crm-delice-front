export interface Module{
    code: string,
    label: string,
    path: string,
    uuid?: string
}

export interface Role{
    uuid?: string
    label: string
    code: string
    roleType: string
    moduleUUID: string
}

export interface ModuleResponse{
    module?: Module,
    error?: string
}

export interface ModuleListResponse{
    modules?: Module[],
    error?: string
}

export enum ModulesFormType{
    EMPTY,
    REGISTER_MODULE,
    REGISTER_ROLE,
    EDIT_MODULE
}

export interface ModuleDeleteResponse{
    message?: string,
    error?: string
}

export interface ModuleWithRolesResponse {
    module?: Module,
    roles?: Role[],
    error?: string
}

export interface RoleResponse{
    role?: Role,
    error?: string
}

export interface RoleDeleteResponse{
    message?: string,
    error?: string
}

export interface RolesArrayResponse{
    roles?: Role[],
    error?: string
}