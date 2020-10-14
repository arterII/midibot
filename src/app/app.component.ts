import {Component, OnInit} from '@angular/core';
import {of} from "rxjs";
import {PatternsFacade} from "./service/patterns/facade/patterns-facade";
import {SongFacade} from "./service/songs/facade/song-facade";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  constructor(
      private patternsFacade: PatternsFacade,
      private songFacade: SongFacade,
  ) {
  }
  title = 'Midibot';
  isSidenavOpen$ = of(true);

  ngOnInit(): void {
    this.patternsFacade.initDefaultPatterns();
    this.songFacade.initSampleSongs();
  }
}
