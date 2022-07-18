import { Component } from '@angular/core';
import { SocketClient } from './utils/socket-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  client = new SocketClient();

  message = "";

  messages$ = this.client.messages$;

  send() {
    this.client.sendMessage({text: this.message});
  }
}
