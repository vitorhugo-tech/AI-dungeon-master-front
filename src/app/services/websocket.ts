// ws.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private ws!: WebSocket;
  private messageSubject = new Subject<string>();
  private token = localStorage.getItem('access_token') ?? '';
  private info = { token: this.token, prompt: '', campanha_id: '' };
  public messages$: Observable<string> = this.messageSubject.asObservable();
  public campanha_id: string = '';

  constructor() {}

  connect(prompt: string, campanha_id: string = ''){
    this.ws = new WebSocket('ws://127.0.0.1:8000/api/v1/ws');
    this.info.prompt = prompt;
    this.info.campanha_id = campanha_id;

    this.ws.onopen = () => {
      console.log('Conectado ao WebSocket');
      this.ws.send(JSON.stringify(this.info));
    };
  }

  createCampanha(personagem_id: string) {
    this.connect(personagem_id)

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('Erro do servidor:', data.error);
        } else if (data.text) {
          this.campanha_id  = data.campanha_id;
          this.messageSubject.next(data.text);
        }
      } catch (err) {
        console.error('Falha ao parsear mensagem:', err, event.data);
      }
    };

    this.ws.onclose = (event) => console.log('WebSocket fechado', event.code, event.reason);
    this.ws.onerror = (err) => console.error('Erro no WebSocket:', err);
  }

  sendMessageCampanha(prompt: string, campanha_id: string) {
    if (!this.ws || this.ws.readyState != WebSocket.OPEN) {
      this.connect(prompt, campanha_id);
    } else {
      this.info.prompt = prompt;
      this.info.campanha_id = campanha_id;
      this.ws.send(JSON.stringify(this.info));
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error('Erro do servidor:', data.error);
        } else if (data.text) {
          this.campanha_id  = data.campanha_id;
          this.messageSubject.next(data.text);
        }
      } catch (err) {
        console.error('Falha ao parsear mensagem:', err, event.data);
      }
    };
  }

  disconnect() {
    this.ws?.close();
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
