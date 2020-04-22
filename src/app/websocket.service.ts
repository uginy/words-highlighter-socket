import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WebsocketService {
  private socket;
  constructor() {}

  connect(): Subject<MessageEvent> {
    this.socket = io("https://words-server.lilmod.pro");

    const observable = new Observable(obs => {
      this.socket.on("message", data => obs.next(data));
      return () => this.socket.disconnect();
    });

    const observer = {
      next: (data: object) => {
        this.socket.emit("message", JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
  }
}
