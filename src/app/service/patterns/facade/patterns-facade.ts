import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateWithPatterns } from '../store/reducer';
import {initDefaultPatternsAction} from "../store/actions/available-patterns.actions";
import {
    defaultPatterns,
    defaultPatternSets, demoData, patternCode2Pitch,
    patternDemoSet,
    sampleProgressions, sampleSequence, songTemplate,
} from "../../midibot/midibot.constants";
import {selectAllAvailablePatterns} from "../store/selectors/available-patterns.selector";
import {initDefaultPatternSetsAction} from "../store/actions/available-pattern-sets.actions";
import {selectAllAvailablePatternSets} from "../store/selectors/available-pattern-sets.selector";
import {selectAllAvailableChordProgressions} from "../store/selectors/available-chord-progressions.selector";
import {initSampleChordProgressionsAction} from "../store/actions/available-chord-progressions.actions";
import {Pattern, PatternSet, PatternSetPart, Progression, Song, SongData} from "../../midibot/midibot.model";
import {MidiFileModel} from "../../midi-file/midi-file.model";
import {MidiFileService} from "../../midi-file/midi-file.service";
import {MidibotService} from "../../midibot/midibot.service";


@Injectable()
export class PatternsFacade {

    constructor(
        private store: Store<StateWithPatterns>,
        private midiFileService: MidiFileService,
        private midibotService: MidibotService,
    ) {
    }

    availablePatterns$ = this.store.select(selectAllAvailablePatterns);
    availablePatternSets$ = this.store.select(selectAllAvailablePatternSets);
    availableChordProgressions$ = this.store.select(selectAllAvailableChordProgressions);

    initDefaultPatterns() {
        this.store.dispatch(initDefaultPatternsAction({patterns: defaultPatterns}));
        this.store.dispatch(initDefaultPatternSetsAction({patternSets: defaultPatternSets}));
        this.store.dispatch(initSampleChordProgressionsAction({progressions: sampleProgressions}));
    }

    createMidiDownloadForPattern(pattern: Pattern) {
        const patternSet = patternDemoSet;
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
        this.downloadPattern(midiBlob, this.createMidiFileName(pattern.id));
    }

    createMidiDownloadForPatternSet(patterSetSource: PatternSet, tempo: number, chordProgression: Progression) {
        const song = { ...songTemplate};
        song.tempo = tempo;
        const patternSet = {
            ...patterSetSource
        };
        patternSet.patterns = patterSetSource.patterns.map( pat => {
            const ret: PatternSetPart = { ...pat };
            ret.pattern = {... pat.pattern}
            ret.pattern.pitches = pat.pattern.pC.map(code=>patternCode2Pitch(code,pat.pattern.pC[0]));
            return ret;

        })
        const sequence = { ...sampleSequence, id: 'cloned-sequence' };
        sequence.sequenceParts = [ {progressionId: chordProgression.id, repetition: sampleSequence.sequenceParts[0].repetition} ];
        song.sequenceIds = [sequence.id];
        song.patternChanges = [
            {
                sequenceId: sequence.id,
                patternSetId: patternSet.id
            }
        ]
        const songData = demoData;
        songData.patternSets = [patternSet];
        songData.sequences = [sequence];
        songData.progressions = [chordProgression];
        console.log('Song', song, songData, chordProgression.id);
        const midifile = this.createSample(song, songData);
        const midiBlob = this.midiFileService.createMidiFile(midifile);
        this.downloadPattern(midiBlob, this.createMidiFileName(patternSet.id, 'patternset'));
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

    downloadPattern(blob: Blob, filename: string) {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = filename;
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(objectUrl);
    }

}
