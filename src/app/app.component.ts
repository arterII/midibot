import {Component, ElementRef, OnInit, VERSION, ViewChild} from '@angular/core';
import {MidiFileService} from "./service/midi-file.service";
import {MidiFileModel} from "./service/midi-file.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  constructor(private midiFileService: MidiFileService, private sanitizer: DomSanitizer) {
  }
  name = 'Angular ' + VERSION.major;

  midi: Blob;
  sample: MidiFileModel = {
    name: 'Sample',
    speed: 500000,
    format: 1,
    deltaTimeTicks: 46,
    numberOfTracks: 1
  };

  get download(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.midi));
  }

  ngOnInit(): void {

    const logger = (content: string) => {
      const hexArr = this.midiFileService.stringToChars(content).map(c => ('0' + c.toString(16)).slice(-2));

      console.log(hexArr);
    }
    const reader = new FileReader();
    reader.onload = function() {
      logger(reader.result as string);
    }
    this.midi = this.midiFileService.createMidiFile(this.sample);
    reader.readAsText(this.midi);

  };
}
