import {Component, OnInit, VERSION} from '@angular/core';
import {MidiFileService} from "./service/midi-file.service";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  constructor(private midiFileService: MidiFileService) {
  }
  name = 'Angular ' + VERSION.major;

  ngOnInit(): void {
    console.log(this.midiFileService.intToOctets(844,8,3));
    console.log(this.midiFileService.intToOctets(63433,8,3));
    console.log(this.midiFileService.intToOctets(1263433,8,1));
  }
}
