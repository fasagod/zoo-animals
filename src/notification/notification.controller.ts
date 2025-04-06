import { Controller, MessageEvent, Param, Res, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { AnimalMessage } from './notification.interface';

@Controller('notifications')
export class NotificationController {
  constructor(
    private eventEmitter: EventEmitter2,
    private notificationService: NotificationService,
  ) {
    this.eventEmitter.on('animal.created', (data: AnimalMessage) =>
      this.notificationService.sendData(data),
    );
  }

  @Sse('sse/:userId')
  sse(
    @Param('userId') userId: number,
    @Res() res: Response,
  ): Observable<MessageEvent> {
    const clientId = Number(userId);
    console.log(`Client ${clientId} connecting...`);
    const subject = this.notificationService.addClient(clientId);

    const clientSubscription = subject.subscribe({
      next: (data: MessageEvent) => {
        if (!res.headersSent) {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
      },
      complete: () => {
        console.log(`Client ${clientId} completed.`);
        this.notificationService.deleteClient(clientId);
        if (!res.headersSent) {
          res.end();
        }
      },
      error: (err) => {
        console.error(`Error with client ${clientId}:`, err);
        this.notificationService.deleteClient(clientId);
        if (!res.headersSent) {
          res.end();
        }
      },
    });

    res.on('close', () => {
      console.log(`Client ${clientId} disconnected.`);
      clientSubscription.unsubscribe();
      this.notificationService.deleteClient(clientId);

      if (!res.headersSent) {
        res.end();
      }
    });

    return subject;
  }
}
