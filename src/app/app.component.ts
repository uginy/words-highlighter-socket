import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  OnDestroy
} from "@angular/core";
import { EditService } from "./edit.service";
import { interval, Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private editService: EditService) {
    this.unsubscribeAll = new Subject();
  }
  unsubscribeAll: Subject<any>;
  clock;
  updated;
  edit = false;
  isOutsideEditor = false;
  isEditable = true;
  isMyOrder = true;
  isEmptyText = false;
  previousText;
  isUserNameEditing = false;
  me = "UserName" + Math.floor(Math.random() * 100);
  user = this.me;
  words = ["Lorem", "Ipsum", "1500s", "book"];
  text =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book";
  changedText = this.text;

  @HostListener("document:click")
  clickout() {
    this.isOutsideEditor && this.edit && this.onEdit();
  }

  ngOnInit() {
    (interval(1000) as any)
      .pipe(
        takeUntil(this.unsubscribeAll),
        map(tick => new Date())
      )
      .subscribe(time => (this.clock = time));

    this.previousText = this.text.slice();
    this.onCheckMatching();

    this.editService.editorState.subscribe(data => {
      const res = JSON.parse(data.text);
      this.user = res.user;
      this.text = res.text;
      this.isEditable = this.edit ? true : res.isEditable;
      this.words = res.words;
      this.previousText = this.text;
      this.updated = res.updated;
      this.onCheckMatching();
    });
  }

  sendText(user, text, status, words, updated) {
    this.editService.sendTxt({
      user,
      text,
      isEditable: status,
      words,
      updated
    });
  }

  onEdit() {
    if (this.isEditable) {
      if (this.text === "") {
        this.isEmptyText = true;
        this.text = this.previousText;
      } else {
        this.isEmptyText = false;
      }

      this.edit = !this.edit;

      if (this.edit) {
        this.isEditable = false;
        this.updated = this.updated;
      } else {
        this.onCheckMatching();
        this.isEditable = true;
        this.user = this.me;
        this.updated = this.clock;
      }

      this.sendText(
        this.user,
        this.text,
        this.isEditable,
        this.words,
        this.updated
      );
    }
  }

  onRemove(index) {
    this.words.splice(index, 1);
    this.onCheckMatching();
    this.sendText(this.me, this.text, this.isEditable, this.words, this.clock);
  }

  onAdd(val) {
    if (val && this.words.indexOf(val.value) === -1) this.words.push(val.value);
    this.onCheckMatching();
    if (this.edit) this.isEditable = false;
    this.sendText(this.me, this.text, this.isEditable, this.words, this.clock);
  }

  onCheckMatching() {
    if (this.text && this.words && this.words.length) {
      const pattern = new RegExp(this.words.join("|"), "g");
      const replacedText = this.text.replace(pattern, name => {
        return `<span style='background-color:yellow'>${name}</span>`;
      });
      this.changedText = replacedText;
    } else {
      this.changedText = this.text;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
