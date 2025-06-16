import { EUserRole } from "../enums";

export interface IJwtPayload {
  id: string;
  name: string;
  role: EUserRole;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}