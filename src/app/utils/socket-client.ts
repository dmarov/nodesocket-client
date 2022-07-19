import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { ApiMessage } from '../core/shared-models/api-message';
import { ClientMessageTypes } from '../core/shared-models/client-message-types';
import { Message } from '../core/shared-models/message';
import { ServerMessageTypes } from '../core/shared-models/server-message-types';

export class SocketClient {

  private socket = io('ws://localhost:4000');

  messages$ = new BehaviorSubject<ApiMessage[]>([]);
  limit$ = new BehaviorSubject<number>(0);

  constructor() {
    this.socket.on(ServerMessageTypes.SetInitialData, payload => {
      const obj = payload;

      this.messages$.next(obj.initialMessages);
      this.limit$.next(obj.settings.messages.bufferSize);
    });

    this.socket.on("add-message-success", message => {
      const newMessage = message;
      const messages = this.messages$.getValue();
      messages.push(newMessage);

      this.messages$.next(messages.slice(-1 * this.limit$.getValue()));
    });
  }

  sendMessage(message: Message) {
    const payload = message;
    this.socket.emit(ClientMessageTypes.AddMessage, payload);
  }
}
