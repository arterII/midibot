import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {MidibotArrangerComponent} from "./midibot-arranger.component";
import {MidiFileServiceModule} from "../../service/midi-file/midi-file-service.module";
import {MidibotServiceModule} from "../../service/midibot/midibot-service.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        MidiFileServiceModule,
        MidibotServiceModule,
        RouterModule
    ],
  declarations: [MidibotArrangerComponent],
  exports: [
    MidibotArrangerComponent
  ],
})
export class MidibotArrangerModule { }
