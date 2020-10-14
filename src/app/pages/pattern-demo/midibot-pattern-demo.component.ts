import {Component, OnDestroy, OnInit, VERSION} from '@angular/core';
import {chordLabelForType, keysForLevel, sampleProgression} from "../../service/midibot/midibot.constants";
import {Pattern, PatternSet, Progression} from "../../service/midibot/midibot.model";
import {PatternsFacade} from "../../service/patterns/facade/patterns-facade";
import {Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {FormControl} from "@angular/forms";

const defaultTempo = 120;

@Component({
    selector: 'arranger',
    templateUrl: './midibot-pattern-demo.component.html',
})
export class MidibotPatternDemoComponent implements OnInit, OnDestroy {

    constructor(
        private patternsFacade: PatternsFacade
    ) {
    }


    tempo = new FormControl();
    tempoFormatted$ = this.tempo.valueChanges.pipe(
        startWith(defaultTempo),
        map(val => Math.round(val))
    );

    chordProgression = new FormControl();
    chordProgressions$ = this.patternsFacade.availableChordProgressions$;

    name = 'Angular ' + VERSION.major;

    midi: Blob;

    private unsubscribe$ = new Subject();
    availablePatterns$ = this.patternsFacade.availablePatterns$;
    availablePatternSets$ = this.patternsFacade.availablePatternSets$;

    patterns: Pattern[];
    patternSets: PatternSet[];
    progressions: Progression[];
    currentTempo = defaultTempo;
    currentChordProgression = sampleProgression.id;

    downloadForPattern(patternId: string) {
        const pattern: Pattern = {
            ...this.patterns.find(pattern => pattern.id === patternId),
        };
        this.patternsFacade.createMidiDownloadForPattern(pattern);
    }

    downloadForPatternSet(patternSetId: string) {
        const origSet = this.patternSets.find(set => set.id === patternSetId);
        const progression = this.progressions.find(pr => pr.id === this.currentChordProgression);
        this.patternsFacade.createMidiDownloadForPatternSet(origSet, this.currentTempo, progression);
    }

    getProgressionLabel(prog: Progression) {
        const chordnames = prog.chords.map(chord => chordLabelForType(chord.chordType, keysForLevel[chord.level]));
        return chordnames.join(' ');
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ngOnInit(): void {

        this.availablePatternSets$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            patternSets => this.patternSets = patternSets
        )

        this.availablePatterns$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            patterns => this.patterns = patterns
        )

        this.chordProgressions$.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            prog => this.progressions = prog
        )

        this.tempo.valueChanges.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            tempo => this.currentTempo = tempo
        )

        this.chordProgression.valueChanges.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(
            prog => {
                this.currentChordProgression = prog;
                console.log('ValueChange chordProgression', prog);
            }
        )

        this.tempo.patchValue( defaultTempo);

    };
}
