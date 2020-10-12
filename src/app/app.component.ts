import {Component, OnInit} from '@angular/core';
import {of} from "rxjs";
import {PatternsFacade} from "./service/patterns/facade/patterns-facade";

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  constructor(
      private patternsFacade: PatternsFacade
  ) {
  }
  title = 'Midibot';
  isSidenavOpen$ = of(true);

  ngOnInit(): void {
    this.patternsFacade.initDefaultPatterns();
  }
}
