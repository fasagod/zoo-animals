import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';
import { Animal } from 'src/animal/animal.entity';
import { AnimalMessage } from './notification.interface';

@Injectable()
export class NotificationService {
  connectedClients = new Map<number, Subject<MessageEvent>>();

  constructor(private eventEmitter: EventEmitter2) {}

  async notifyAnimalCreated(animal: Animal) {
    const categories = await animal.categories.loadItems();
    console.log('categories ', categories);
    for (const category of categories) {
      const users = await category.users.loadItems();
      console.log('users ', users);
      for (const user of users) {
        const userId = user.id;
        this.eventEmitter.emit('animal.created', { animal, userId });
      }
    }
  }

  addClient(clientId: number) {
    const subject = new Subject<MessageEvent>();
    this.connectedClients.set(clientId, subject);
    console.log(
      `Client ${clientId} added to connectedClients. Total clients: ${this.connectedClients.size}`,
    );
    return subject.asObservable();
  }

  deleteClient(clientId: number) {
    this.connectedClients.delete(clientId);
    console.log(
      `Client ${clientId} removed from connectedClients due to error. Total clients: ${this.connectedClients.size}`,
    );
  }

  sendData(data: AnimalMessage) {
    console.log(`Sending data to client ${data.userId}`);
    const client = this.connectedClients.get(data.userId);
    if (client) {
      const mess = new MessageEvent('animal.created', {
        data: `Появилось новое животное ${data.animal.name}`,
      });
      client.next(mess);
    } else {
      console.warn(`Client ${data.userId} not found in connectedClients.`);
    }
  }
}
