import {Component} from '@angular/core';
import {MidiFileService} from "../../service/midi-file/midi-file.service";
import {MidibotService} from "../../service/midibot/midibot.service";
import {DomSanitizer} from "@angular/platform-browser";
import {PatternsFacade} from "../../service/patterns/facade/patterns-facade";

@Component({
    selector: 'mixer',
    templateUrl: './midibot-mixer.component.html',
})
export class MidibotMixerComponent  {

    constructor(
        private midiFileService: MidiFileService,
        private midibotService: MidibotService,
        private sanitizer: DomSanitizer,
        private patternsFacade: PatternsFacade
    ) {
    }

    availablePatternSets$ = this.patternsFacade.availablePatternSets$;
}
