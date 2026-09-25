import { api } from "@/services/api";
import { User, UserRole } from "@/model/user";

export type SafeUser = Omit<User, "password">;

export interface CreateUserInput {
  name: string;
  password: string;
  type: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  password?: string;
  type?: UserRole;
}

export class UserService {
  async list(): Promise<SafeUser[]> {
    const { data } = await api.get<SafeUser[]>("/users");
    return data;
  }

  async getById(id: string): Promise<SafeUser> {
    const { data } = await api.get<SafeUser>(`/users/${id}`);
    return data;
  }

  async create(input: CreateUserInput): Promise<SafeUser> {
    const { data } = await api.post<SafeUser>("/users", input);
    return data;
  }

  async update(id: string, input: UpdateUserInput): Promise<SafeUser> {
    const { data } = await api.put<SafeUser>(`/users/${id}`, input);
    return data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async authenticate(name: string, password: string): Promise<SafeUser> {
    const { data } = await api.post<SafeUser>("/auth/employee-login", { name, password });
    return data;
  }
}

export const userService = new UserService();