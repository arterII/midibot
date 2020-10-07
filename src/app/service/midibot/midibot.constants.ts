import {
    ChordType,
    MeasureLength,
    NoteLength,
    Pattern,
    PatternSet,
    Pitch,
    PitchPart,
    Progression,
    Sequence,
    Song,
    SongData
} from "./midibot.model";
import {MidiFileModel, MidiInstrument} from "../midi-file/midi-file.model";

export const patternCode2PitchPart = (code: string): PitchPart => {
    console.log('parse code', code);
    const ret: PitchPart = {
        index: 0,
        length: NoteLength.quarter,
        repetitions: 1
    };
    const split=/[a-w,A-W]/.exec(code);
    let i = 0;
    const index= code.substr(0, split.index);
    ret.index = parseInt(index);
    const delta=/[+|-]/.exec(code);
    if(delta) {
        const deltaindex = delta.index;
        if (code[deltaindex] === '+') {
            ret.deltaoctave = parseInt(code[deltaindex + 1]);
        }
        if (code[deltaindex] === '-') {
            ret.deltaoctave = -parseInt(code[deltaindex + 1]);
        }
    }
    const len = code[split.index];
    switch(len) {
        case 'w': ret.length = NoteLength.whole; break;
        case 'H': ret.length = NoteLength.halfdotted; break;
        case 'h': ret.length = NoteLength.half; break;
        case 'Q': ret.length = NoteLength.quarterdotted; break;
        case 'q': ret.length = NoteLength.quarter; break;
        case 'E': ret.length = NoteLength.eightsdotted; break;
        case 'e': ret.length = NoteLength.eights; break;
        case 's': ret.length = NoteLength.sixteenth; break;
        case 't': ret.length = NoteLength.thirtysecond; break;
    }
    let rest = code.substr(split.index +1);
    const vsplit = /[v]/.exec(rest);
    if(vsplit) {
        ret.velocity = parseInt(rest.substr(vsplit.index+1));
        rest = rest.substr(0, vsplit.index);
    }
    if(rest) {
        if(rest[0]) {
            ret.repetitions = parseInt(rest[0]);
            if(rest[1]) {
                ret.index4 = parseInt(rest[1]);
            }
        }
    }
    return ret;
}

export const patternCode2Pitch = (code: string, baseCode): Pitch => {
    const ret: Pitch = {
        repetitions:1,
        sequence:[]
    }
    console.log('Parse ', code, baseCode)
    let parseCode = code;
    if(code[1] === '*') {
        parseCode = baseCode;
    }
    let cd = parseCode;
    if(code[1]==='x') {
        ret.repetitions = parseInt(code[0]);
        cd = parseCode.substr(2);
    }
    ret.sequence = cd.split(' ').map( codepart => patternCode2PitchPart(codepart));
    if(code[1] === '*') {
        ret.sequence = ret.sequence.map(part => ({...part, index: part.index === 0 ? parseInt(code[0]) : part.index}))
    }
    console.log('Parsed ', code, parseCode, ret)
    return ret;
}

export const pattern1Strum: Pattern = {
    id: '1Strum',
    name: 'Strum full measure',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.STRINGS,
    pC: [
        '0w1v70',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern8Arp1: Pattern = {
    id: '8Arp1',
    name: 'Arpeggio eights 1',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.PIANO,
    pC: ['0e 1e 2e13 0+1e 2e13 1e 0e 1e'],
}

export const pattern4Strum1: Pattern = {
    id: '4Strum1',
    name: 'Strum quarter 1',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0q4',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern8Strum1: Pattern = {
    id: '8Strum1',
    name: 'Strum eights 1',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0e8',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern82MStrum1: Pattern = {
    id: '8M2Strum1',
    name: 'Strum eights 2 measures 1',
    length: 2*MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0e8 0q4',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern82MStrum2: Pattern = {
    id: '8M2Strum2',
    name: 'Strum eights 2 measures 2',
    length: 2*MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0q -1e 0e 0q -1e 0e 0q -1e 0e5',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern82MStrum3: Pattern = {
    id: '8M2Strum3',
    name: 'Strum eights 2 measures 3',
    length: 2*MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0q 0q -1e 0e 0q -1e 0e7',
        '1*',
        '2*',
        '3*'
    ],
}

export const pattern8Strum2: Pattern = {
    id: '8Strum2',
    name: 'Strum eights 2',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.GUITAR,
    pC: [
        '0q2 0e4',
        '1*',
        '2*',
        '3*',
    ],
}

export const pattern4Drums1: Pattern = {
    id: '4Drums1',
    name: 'Drums quarter 1',
    length: MeasureLength.fourquarter,
    isDrum: true,
    defaultInstrument: MidiInstrument.DRUMS,
    pC: ['47q', '51q4v120'],
}

export const patternDrumsSplash: Pattern = {
    id: 'DrumsSplash',
    name: 'Drums Splash',
    length: MeasureLength.fourquarter,
    isDrum: true,
    defaultInstrument: MidiInstrument.DRUMS,
    pC: ['2x47E2 47e', '2x-1q 48q', '51e8'],
}

export const patternBassSplash: Pattern = {
    id: 'BassSplash',
    name: 'Bass Splash',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.BASS,
    pC: ['0s2 -1s3 0s 1e 1+1s -1s5 0s 1s'],
}

export const patternLeadSplash: Pattern = {
    id: 'LeadSplash',
    name: 'Lead Splash',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.PIANO,
    pC: ['0s2 -1q 0s2 -1q 0s3'],
}

export const patternBassPush: Pattern = {
    id: 'BassPush',
    name: 'Bass Push',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.BASS,
    pC: ['-1e 0s -1e 0s -1s 0s 0q -1E 0s'],
}

export const patternLeadPush: Pattern = {
    id: 'LeadPush',
    name: 'Lead Push',
    length: MeasureLength.fourquarter,
    defaultInstrument: MidiInstrument.PIANO,
    pC: ['0s 0E3 -1s6'],
}
export const patternDemoSet: PatternSet = {
    id: 'sample-pattern',
    name: 'Pattern sample',
    length: MeasureLength.fourquarter,
    patterns: [
    ]
}

export const patternSet1: PatternSet = {
    id: 'sample-pattern-set',
    name: 'Pattern sample 1',
    length: MeasureLength.fourquarter,
    patterns: [
        {
            instrument: MidiInstrument.DRUMS,
            pattern: pattern4Drums1,
            octave: 0,
        },
        {
            instrument: MidiInstrument.SYNTH,
            pattern: pattern4Strum1,
            octave: 4,
        },
        {
            instrument: MidiInstrument.PIANO,
            pattern: pattern8Arp1,
            octave: 4,
        },
    ]
};

export const patternSetM21: PatternSet = {
    id: 'sample-pattern-set-m2',
    name: 'Pattern sample 2 Measures 1',
    length: 2*MeasureLength.fourquarter,
    patterns: [
        {
            instrument: MidiInstrument.DRUMS,
            pattern: pattern4Drums1,
            octave: 0,
        },
        {
            instrument: MidiInstrument.PIANO,
            pattern: pattern82MStrum1,
            octave: 4,
        },
    ]
};

export const patternSetSplash: PatternSet = {
    id: 'pattern-set-splash',
    name: 'Splash',
    length: MeasureLength.fourquarter,
    patterns: [
        {
            instrument: MidiInstrument.DRUMS,
            pattern: patternDrumsSplash,
            octave: 0,
        },
        {
            instrument: MidiInstrument.PIANO,
            pattern: patternLeadSplash,
            octave: 6,
        },
        {
            instrument: MidiInstrument.BASS,
            pattern: patternBassSplash,
            octave: 3,
        },
        {
            instrument: MidiInstrument.STRINGS,
            pattern: pattern1Strum,
            octave: 5,
        },
    ]
};

export const patternSetPush: PatternSet = {
    id: 'pattern-set-push',
    name: 'Push',
    length: MeasureLength.fourquarter,
    patterns: [
       {
            instrument: MidiInstrument.BASS,
            pattern: patternBassPush,
            octave: 3,
        },
        {
            instrument: MidiInstrument.STRINGS,
            pattern: pattern1Strum,
            octave: 5,
        },
        {
            instrument: MidiInstrument.GUITAR,
            pattern: patternLeadPush,
            octave: 6,
        },
    ]
};

export const patterns: Pattern[] = [pattern8Arp1, pattern1Strum, pattern4Strum1, pattern4Drums1, pattern8Strum1,
    pattern8Strum2, pattern82MStrum1, pattern82MStrum2, pattern82MStrum3,
    patternDrumsSplash, patternBassSplash, patternLeadSplash,
    patternBassPush, patternLeadPush];
export const patternSets: PatternSet[] = [patternSet1, patternSetM21, patternSetSplash, patternSetPush];

export const chordMajor: ChordType = {
    labelFn: (key: string) => key.toUpperCase(),
    id: 'Maj',
    name: 'Major',
    levels: [0,4,7]
}
export const chordMinor: ChordType = {
    labelFn: (key: string) => key.toLowerCase() + 'm',
    id: 'Min',
    name: 'Minor',
    levels: [0,3,7]
}
export const chordMajorSeventh: ChordType = {
    labelFn: (key: string) => key.toUpperCase() + '7',
    id: '7',
    name: 'Seventh',
    levels: [0,4,7,10]
}
export const chordMinorSeventh: ChordType = {
    labelFn: (key: string) => key.toLowerCase() + 'm7',
    id: 'Min7',
    name: 'Minor Seventh',
    levels: [0,4,7,10]
}

export const chordTypes: ChordType[] = [chordMajor, chordMinor, chordMajorSeventh, chordMinorSeventh]

export const sampleProgression: Progression = {
    id: 'sample-progression',
    chords: [
        { level: 0, chordType: 'Maj', length: MeasureLength.fourquarter },
        { level: 5, chordType: 'Maj', length: MeasureLength.fourquarter },
        { level: 7, chordType: 'Maj', length: MeasureLength.fourquarter },
        { level: 0, chordType: 'Maj', length: MeasureLength.fourquarter },
    ],
}

export const sampleSequence: Sequence = {
    id: 'sample-sequence',
    sequenceParts: [
        { progressionId: 'sample-progression', repetition: 3},
        { chord: { level: 0, chordType: 'Maj', length: MeasureLength.fourquarter }}
     ]
}

export const sampleSong: Song = {
    id: 'sample-song',
    sequenceIds: [
        'sample-sequence'
    ],
    patternChanges: [{
        sequenceId: 'sample-sequence',
        patternSetId: 'sample-pattern',
    }]
}

export const demoData: SongData = {
    patternSets: [patternDemoSet],
    sequences: [sampleSequence],
    progressions: [sampleProgression],
}

export const defaultMidiFileModel: MidiFileModel = {
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
};
