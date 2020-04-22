import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket.service";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class EditService {
  editorState: Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.editorState = wsService.connect() as Subject<any>;
  }
  sendTxt(data) {
    this.editorState.next(data);
  }

}
