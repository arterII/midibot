import {Component, VERSION} from '@angular/core';
import {MidiFileService} from "../../service/midi-file/midi-file.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MidiFileModel, MidiInstrument} from "../../service/midi-file/midi-file.model";
import {MidibotService} from "../../service/midibot/midibot.service";
import {
    demoData, patternCode2Pitch,
    patternCode2PitchPart,
    patternDemoSet,
    patterns, patternSets,
    sampleSong
} from "../../service/midibot/midibot.constants";
import {Pattern, PatternSet, PatternSetPart, Song, SongData} from "../../service/midibot/midibot.model";

@Component({
    selector: 'arranger',
    templateUrl: './midibot-arranger.component.html',
    styles: [`h1 { font-family: Lato; }`]
})
export class MidibotArrangerComponent  {

    constructor(
        private midiFileService: MidiFileService,
        private midibotService: MidibotService,
        private sanitizer: DomSanitizer) {
    }
    name = 'Angular ' + VERSION.major;

    midi: Blob;

    demoPatterns = patterns;
    demoPatternSets = patternSets;

    sample: MidiFileModel = this.createSample(sampleSong, demoData);
    get download(): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.midi));
    }

    createMidiDownloadForPattern(patternId: string) {
        const songTemplate = sampleSong;
        const patternSet = patternDemoSet;
        const pattern: Pattern = patterns.find(pattern => pattern.id === patternId);
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
        const origSet = patternSets.find(set => set.id === patternSetId);
        const patternSet = {
            ...origSet
        };
        patternSet.patterns = origSet.patterns.map( pat => {
            const ret: PatternSetPart = pat;
            ret.pattern.pitches = pat.pattern.pC.map(code=>patternCode2Pitch(code,pat.pattern.pC[0]));
            return ret;

        })
        songTemplate.patternChanges = [
            {
                sequenceId: 'sample-sequence',
                patternSetId: patternSetId
            }
        ]
        const songData = demoData;
        songData.patternSets = [patternSet];
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

    };
}
