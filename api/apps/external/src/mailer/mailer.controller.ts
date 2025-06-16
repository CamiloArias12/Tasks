import { Body, Controller, Post, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskStatusChangeNotification } from './types';
import { MailerService } from './mailer.service';



@Controller('mailer')
export class MaileController {

  constructor(private readonly mailerService: MailerService) {}

  @Post('task-status-change')
  @HttpCode(HttpStatus.OK)
  async notifyTaskStatusChange(
    @Body() notification: TaskStatusChangeNotification
  ) {
    
    try {
      if (!notification.userEmail || !notification.taskTitle || !notification.newStatus) {
        return {
          success: false,
          message: 'Missing required fields: userEmail, taskTitle, or newStatus',
          statusCode: 400,
          timestamp: new Date().toISOString(),
        };
      }

      const result = await this.mailerService.sendTaskStatusChangeNotification(notification);
      
      
      return {
        success: true,
        message: 'Task status change notification sent successfully',
        data: {
          messageId: result.messageId,
          taskId: notification.taskId,
          recipient: notification.userEmail,
          taskTitle: notification.taskTitle,
          statusChange: `${notification.oldStatus} → ${notification.newStatus}`,
        },
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {      
      return {
        success: false,
        message: 'Failed to send notification',
        error: error.message,
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
    }
  }

}