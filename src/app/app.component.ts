import {Component, OnInit, VERSION} from '@angular/core';
import {MidiFileService} from "./service/midi-file.service";
import {MidiFileModel, MidiInstrument} from "./service/midi-file.model";
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
    deltaTimeTicks: 48,
    numberOfTracks: 2,
    timeSignature: {
      numerator: 4,
      denominator: 2,
      metronomeTicks: 46,
      note32ndToQuarter: 8
    },
    tracks: [
      {
        name: 'Piano Track',
        instrument: MidiInstrument.PIANO,
        channel: 2,
        events: [
          { delta: 0, key: 108, velocity: 200 },
          { delta: 48, key: 108, velocity: 0 },
          { delta: 48, key: 110, velocity: 180 },
          { delta: 96, key: 110, velocity: 0 },
          { delta: 96, key: 112, velocity: 160 },
          { delta: 144, key: 112, velocity: 0 },
        ]
      }
    ]
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
