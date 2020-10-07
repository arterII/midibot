export enum MidiInstrument {
    'DRUMS' = -1,
    'PIANO' = 0,
    'GUITAR' = 0x18,
    'BASS' = 0x21,
    'STRINGS' = 0x30,
    'SYNTH' = 0x50,
}

export enum MidiDrums {
    'BASSDRUM' = 35,
    'SNAREDRUM' = 38,
    'CLOSEDHIHAT'= 42,
    'PEDALHIHAT'= 42,
    'LOWTOM' = 43,
    'MIDTOM' = 47,
    'CRASHCYMBAL' = 49,
    'HIGHTOM' = 50,
    'RIDECYMBAL' = 51,
    'CHINESECYMBAL' = 52,

}

export interface MidiNoteEvent {
    delta: number;
    key: number;
    velocity: number;
}

export interface AbsoluteNoteEvent {
    start: number;
    length: number;
    key: number;
    velocity: number;
}

export interface MidiTrackModel {
    name?: string;
    instrument: MidiInstrument;
    channel: number;
    events: MidiNoteEvent[];
    absoluteEvents?: AbsoluteNoteEvent[];
}

export interface TimeSignature {
    numerator: number;
    denominator: number;
    metronomeTicks: number;
    note32ndToQuarter: number;
}

export interface MidiFileModel {
    name?: string;
    format: number;
    numberOfTracks: number;
    deltaTimeTicks: number;
    timeSignature?: TimeSignature;
    speed: number;
    tracks?: MidiTrackModel[];
}
