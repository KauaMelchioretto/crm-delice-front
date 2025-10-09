import {
  User,
  UserResponse,
  UsersListResponse,
  UserRolesResponse,
  SimpleUserListResponse,
} from "../entities/entities";
import { http } from "../../../core/config/api/http.ts";
import { AxiosError } from "axios";
import { CrmFilter, CrmOrderBy } from "../../../utils/entities/entities.ts";

class UsersRepository {
  USERS_UNEXPECTED_ERROR = 'USER_UNEXPECTED';

  async createUser(user: User): Promise<UserResponse> {
    try {
      const response = await http.post("/auth/register", {
        login: user.login,
        password: user.password,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        status: user.status,
        avatar: user.avatar,
        document: user.document,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        state: user.state,
        city: user.city,
        zipCode: user.zipCode,
        address: user.address,
      });

      return { user: response.data?.user };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }
      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async getUsers(
    page: number,
    filter: CrmFilter | null,
    orderBy: CrmOrderBy | null
  ): Promise<UsersListResponse> {
    try {
      let query = "";

      if (filter?.field) {
        query += `&${filter.field}=${filter.value}`;
      } else if (!filter?.field && filter?.value) {
        query += `&allFields=${filter?.value}`;
      }

      if (orderBy?.field) {
        query += `&orderBy=${orderBy?.field}:${orderBy?.ordenation}`;
      } else {
        query += `&orderBy=login`;
      }

      const response = await http.get(
        `/user/getPagination?count=10&page=${page}${query}`
      );

      return response.data?.users as UsersListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async getUserByUUID(userUUID: string): Promise<UserResponse> {
    try {
      const response = await http.get(`/user/getByUUID?uuid=${userUUID}`);

      return { user: response.data?.user };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async getUserRolesByUUID(userUUID: string): Promise<UserRolesResponse> {
    try {
      const response = await http.get(`/roles/rolesPerUser?uuid=${userUUID}`);

      return response.data as UserRolesResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async attachRolePerUser(
    userUUID: string,
    rolesUUID: string[]
  ): Promise<UserRolesResponse> {
    try {
      const response = await http.post(`/roles/attach/${userUUID}`, rolesUUID);

      return response.data as UserRolesResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async saveUser(user: User): Promise<UserResponse> {
    try {
      const response = await http.post("/user/update", {
        uuid: user.uuid,
        name: user.name,
        surname: user.surname,
        email: user.email,
        userType: user.userType,
        status: user.status,
        avatar: user.avatar,
        phone: user.phone,
        state: user.state,
        city: user.city,
        zipCode: user.zipCode,
        address: user.address,
      });

      return { user: response.data?.user };
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }
      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }

  async listSimpleUsers(): Promise<SimpleUserListResponse> {
    try {
      const response = await http.get("/user/simple");

      return response.data as SimpleUserListResponse;
    } catch (e) {
      if (e instanceof AxiosError) {
        return {
          error:
            e?.response?.data?.error?.code ?? this.USERS_UNEXPECTED_ERROR,
        };
      }

      return { error: this.USERS_UNEXPECTED_ERROR };
    }
  }
}

export const usersRepository = new UsersRepository();
