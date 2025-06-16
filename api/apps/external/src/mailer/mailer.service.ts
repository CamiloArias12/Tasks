import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TaskStatusChangeNotification } from './types';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT')),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
  }

  async sendTaskStatusChangeNotification(notification: TaskStatusChangeNotification) {

    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: notification.userEmail,
      subject: `Estado de Tarea: ${notification.taskTitle}`,
      html: this.createSimpleTemplate(notification),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        messageId: result.messageId,
        accepted: result.accepted || [notification.userEmail],
        rejected: result.rejected || [],
      };

    } catch (error) {
      throw new Error(`Fallo al enviar email: ${error.message}`);
    }
  }

  private createSimpleTemplate(notification: TaskStatusChangeNotification): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">Estado de Tarea Actualizado</h2>
          
          <p>Hola <strong>${notification.userName}</strong>,</p>
          
          <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #333;">${notification.taskTitle}</h3>
            <p>Estado: <strong>${this.formatStatus(notification.oldStatus)}</strong> → <strong>${this.formatStatus(notification.newStatus)}</strong></p>
          </div>
          <p>Revisa tu panel de control para más detalles.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Gestión de Tareas Inlanze</p>
        </div>
      </div>
    `;
  }

  private formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'todo': 'Por Hacer',
      'in_progress': 'En Proceso', 
      'completed': 'Completada',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  }

}
