import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class WebsocketService {
  private socket;
  constructor() {}

  connect(): Subject<MessageEvent> {
    this.socket = io("api.lilmod.pro");
    // this.socket = io("localhost:5000");

    const observable = new Observable(obs => {
      this.socket.on("message", data => {
        console.log("Received message from Websocket Server");
        obs.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit("message", JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
  }
}
