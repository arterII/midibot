import {Component} from '@angular/core';
import {MidiFileService} from "../../service/midi-file/midi-file.service";
import {DomSanitizer} from "@angular/platform-browser";
import {MidibotService} from "../../service/midibot/midibot.service";
import {PatternsFacade} from "../../service/patterns/facade/patterns-facade";

@Component({
    selector: 'arranger',
    templateUrl: './midibot-arranger.component.html',
    styles: [`h1 { font-family: Lato; }`]
})
export class MidibotArrangerComponent  {

    constructor(
        private midiFileService: MidiFileService,
        private midibotService: MidibotService,
        private sanitizer: DomSanitizer,
        private patternsFacade: PatternsFacade
        ) {
    }

    availablePatternSets$ = this.patternsFacade.availablePatternSets$;
}
