import {MidiInstrument} from "../midi-file/midi-file.model";

export enum NoteLength {
    sixtyfourth = 3,
    thirtysecond = 6,
    sixteenth = 12,
    triplet = 16,
    eights = 24,
    eightsdotted = 36,
    quarter = 48,
    quarterdotted = 72,
    half = 96,
    halfdotted = 144,
    whole = 192,
}

export enum MeasureLength {
    twoquarter = 96,
    threequarter = 144,
    fourquarter = 192
}

export interface PitchPart {
    index: number,
    index4?: number,
    length: number,
    deltaoctave?: number,
    velocity?: number
    repetitions?: number
}

export interface Pitch {
    sequence: PitchPart[],
    repetitions?: number
}

export interface Pattern {
    id: string,
    name?: string,
    length: number,
    isDrum?: boolean,
    pitches?: Pitch[],
    pC?: string[];
    defaultInstrument: MidiInstrument
}

export interface PatternSetPart {
    octave: number,
    instrument: MidiInstrument,
    pattern: Pattern,
    name?: string
}

export interface PatternSet {
    id: string,
    name?: string,
    length: number,
    patterns: PatternSetPart[],
    defaultTempo?: number
}

export interface ChordType {
    id: string,
    labelFn: (key: string) => string;
    name?: string,
    levels: number[]
}

export interface ChordPlay {
    length: number,
    level: number,
    chordType: string,
}

export interface SequencePart {
    chord?: ChordPlay,
    progressionId?: string,
    repetition?: number
}

export interface Progression {
    id: string,
    chords: ChordPlay[],
}

export interface Sequence {
    id: string,
    name?: string,
    sequenceParts: SequencePart[],
}

export interface PatternChange {
    sequenceId: string,
    repetition?: number,
    patternSetId: string
}

export interface Song {
    id: string,
    name?: string,
    sequenceIds: string[],
    patternChanges: PatternChange[],
    tempo: number
}

export interface SongData {
    patternSets: PatternSet[],
    progressions: Progression[],
    sequences: Sequence[],
}
