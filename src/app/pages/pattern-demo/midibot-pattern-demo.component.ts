import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges, VERSION} from '@angular/core';
import {MidiFileService} from "../../service/midi-file/midi-file.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MidiFileModel} from "../../service/midi-file/midi-file.model";
import {MidibotService} from "../../service/midibot/midibot.service";
import {
    chordLabelForType, chordMinor, chordTypes,
    demoData, keysForLevel,
    patternCode2Pitch,
    patternDemoSet, sampleProgression, sampleSequence,
    sampleSong
} from "../../service/midibot/midibot.constants";
import {
    ChordType,
    Pattern,
    PatternSet,
    PatternSetPart,
    Progression,
    Song,
    SongData
} from "../../service/midibot/midibot.model";
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
        private midiFileService: MidiFileService,
        private midibotService: MidibotService,
        private patternsFacade: PatternsFacade,
        private sanitizer: DomSanitizer) {
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

    sample: MidiFileModel = this.createSample(sampleSong, demoData);
    get download(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.midi));
    }

    createMidiDownloadForPattern(patternId: string) {
        const songTemplate = sampleSong;
        const patternSet = patternDemoSet;
        const pattern: Pattern = {
            ...this.patterns.find(pattern => pattern.id === patternId),
        };
        pattern.pitches = pattern.pC.map(code => patternCode2Pitch(code, pattern.pC[0]));
        patternSet.patterns = [{
            octave: 4,
            instrument: pattern.defaultInstrument,
            pattern: pattern
        }];
        const songData = demoData;
        songData.patternSets = [patternSet];
        const midifile = this.createSample(songTemplate, songData);
        const midiBlob = this.midiFileService.createMidiFile(midifile);
        this.downloadPattern(midiBlob, this.createMidiFileName(patternId));
        //return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(midiBlob));
    }

    createMidiDownloadForPatternSet(patternSetId: string) {
        const songTemplate = { ...sampleSong};
        songTemplate.tempo = this.currentTempo;
        const origSet = this.patternSets.find(set => set.id === patternSetId);
        const patternSet = {
            ...origSet
        };
        patternSet.patterns = origSet.patterns.map( pat => {
            const ret: PatternSetPart = { ...pat };
            ret.pattern = {... pat.pattern}
            ret.pattern.pitches = pat.pattern.pC.map(code=>patternCode2Pitch(code,pat.pattern.pC[0]));
            return ret;

        })
        const sequence = { ...sampleSequence, id: 'cloned-sequence' };
        sequence.sequenceParts = [ {progressionId: this.currentChordProgression, repetition: sampleSequence.sequenceParts[0].repetition} ];
        songTemplate.sequenceIds = [sequence.id];
        songTemplate.patternChanges = [
            {
                sequenceId: sequence.id,
                patternSetId: patternSetId
            }
        ]
        const songData = demoData;
        songData.patternSets = [patternSet];
        songData.sequences = [sequence];
        songData.progressions = [this.progressions.find(pr => pr.id === this.currentChordProgression)];
        console.log('Song', songTemplate, songData, this.currentChordProgression);
        const midifile = this.createSample(songTemplate, songData);
        const midiBlob = this.midiFileService.createMidiFile(midifile);
        this.downloadPattern(midiBlob, this.createMidiFileName(patternSetId, 'patternset'));
        //return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(midiBlob));
    }

    downloadPattern(blob: Blob, filename: string) {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = filename;
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(objectUrl);
    }

    createMidiFileName(patternId: string, prefix='pattern') {
        return prefix+'-'+patternId+'-'+Date.now()+'.midi';
    }

    createSample(song: Song, data: SongData): MidiFileModel {
        const midiFile = this.midibotService.createMidi(song, data);
        return {
            ...midiFile,
            tracks: midiFile.tracks.map(track =>  this.midiFileService.translateAbsoluteEvents(track))
        }
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

        const logger = (content: string) => {
            const hexArr = this.midiFileService.stringToChars(content).map(c => ('0' + c.toString(16)).slice(-2));
        }
        const reader = new FileReader();
        reader.onload = function() {
            logger(reader.result as string);
        }
        this.midi = this.midiFileService.createMidiFile(this.sample);
        reader.readAsText(this.midi);

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
                console.log('ValuChange chordProgression', prog);
            }
        )

        this.tempo.patchValue( defaultTempo);

    };
}
