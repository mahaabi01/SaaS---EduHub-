import { Request } from "express";

export interface IExtendedRequest extends Request {
  user ?: {
    id: string,
    currentInstituteNumber ?: string | number | null
    role: Role
  };
  // instituteNumber? : string | null;
  // instituteNumber? : number;
}

export enum Role{
  Teacher = "teacher",
  Institute = "institute",
  SuperAdmin = "super-admin",
  Student = "student"
}
