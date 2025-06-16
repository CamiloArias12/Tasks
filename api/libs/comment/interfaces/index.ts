export interface IComment {
  id?: string;
  description: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}