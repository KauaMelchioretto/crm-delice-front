import {
  Module,
  ModuleDeleteResponse,
  ModuleListResponse,
  ModuleResponse,
  ModuleWithRolesResponse,
  Role,
  RoleByModuleResponse,
  RoleDeleteResponse,
  RoleResponse,
} from "../enitites/entities.ts";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";
import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities.ts";

class ModulesRepository {
  MODULES_UNEXPECTED_ERROR = "An unexpected error has occurred";

  async createModule(module: Module): Promise<ModuleResponse> {
    try {
      const response = await http.post("/roles/createModule", {
        code: module.code,
        label: module.label,
        path: module.path,
        uuid: module.uuid,
      });

      return { module: response.data?.module };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async getModules(
    page: number,
    filter: CrmFilter | null,
    orderBy: CrmOrderBy | null
  ): Promise<ModuleListResponse> {
    try {
      let query = "";

      if (filter?.field) {
        query += `&${filter.field}=${filter.value}`;
      } else if (!filter?.field && filter?.value) {
        query += `&allFields=${filter?.value}`;
      }

      if (orderBy?.field) {
        query += `&orderBy=${orderBy?.field}:${orderBy?.sortable}`;
      } else {
        query += `&orderBy=title`;
      }

      const response = await http.get(
        `/roles/getModulesPagination?count=10&page=${page}${query}`
      );

      return response.data?.modules as ModuleListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async getModuleByUUID(moduleUUID: string): Promise<ModuleResponse> {
    try {
      const response = await http.get(`/roles/getModuleByUUID/${moduleUUID}`);

      return { module: response.data?.module };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async deleteModuleByUUID(moduleUUID: string): Promise<ModuleDeleteResponse> {
    try {
      const response = await http.delete(`/roles/deleteModule/${moduleUUID}`);

      return response.data as ModuleDeleteResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async getModuleWithRoles(
    moduleUUID: string
  ): Promise<ModuleWithRolesResponse> {
    try {
      const response = await http.get(
        `/roles/getRoleByModuleUUID/${moduleUUID}`
      );

      return response.data as ModuleWithRolesResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async registerRole(role: Role): Promise<RoleResponse> {
    try {
      const response = await http.post("/roles/createRole", {
        code: role.code,
        label: role.label,
        moduleUUID: role.moduleUUID,
        roleType: role.roleType,
      });

      return { role: response.data?.role };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async deleteRoleByUUID(roleUUID: string): Promise<RoleDeleteResponse> {
    try {
      const response = await http.delete(`/roles/deleteRole/${roleUUID}`);

      return response.data as RoleDeleteResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }

  async getAllRoles(): Promise<RoleByModuleResponse> {
    try {
      const response = await http.get("/roles/allRoles");

      return response.data as RoleByModuleResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.MODULES_UNEXPECTED_ERROR,
        };
      }
      return { error: this.MODULES_UNEXPECTED_ERROR };
    }
  }
}

export const modulesRepository = new ModulesRepository();
