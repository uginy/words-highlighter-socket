import { TextareaAutosizeModule } from "ngx-textarea-autosize";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { SafePipe } from "./safehtml.pipe";

@NgModule({
  declarations: [AppComponent, SafePipe],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaAutosizeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
