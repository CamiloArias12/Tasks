export interface IProject {
  id?: string;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}