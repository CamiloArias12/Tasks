export type TaskStatusChangeNotification = {
  taskId: string;
  taskTitle: string;
  oldStatus: string;
  newStatus: string;
  userEmail: string;
  userName: string;
  projectName?: string;
}