import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {MidibotArrangerComponent} from "./midibot-arranger.component";
import {MidiFileService} from "../../service/midi-file-service/midi-file.service";
import {MidiFileServiceModule} from "../../service/midi-file-service/midi-file-service.module";

@NgModule({
  imports: [BrowserModule, FormsModule, MidiFileServiceModule],
  declarations: [MidibotArrangerComponent],
  exports: [
    MidibotArrangerComponent
  ],
  providers: [MidiFileService]
})
export class MidibotArrangerModule { }
