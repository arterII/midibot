import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {MidibotMixerComponent} from "./midibot-mixer.component";
import {MidiFileServiceModule} from "../../service/midi-file/midi-file-service.module";
import {MidibotServiceModule} from "../../service/midibot/midibot-service.module";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MidiFileServiceModule,
    MidibotServiceModule
  ],
  declarations: [MidibotMixerComponent],
  exports: [
    MidibotMixerComponent
  ],
})
export class MidibotMixerModule { }
