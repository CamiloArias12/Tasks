import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    const validApiKey = this.configService.get<string>('EXTERNAL_API_KEY', 'externalApiKey123');
    
    console.log('Valid API Key from env:', validApiKey);
    console.log('Received API Key:', apiKey);
    
    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException({
        message: 'Invalid or missing API Key',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }
    
    next();
  }
}