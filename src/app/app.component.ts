import {Component, OnInit, VERSION} from '@angular/core';
import {MidiFileService} from "./service/midi-file-service/midi-file.service";
import {MidiFileModel, MidiInstrument} from "./service/midi-file-service/midi-file.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
}
