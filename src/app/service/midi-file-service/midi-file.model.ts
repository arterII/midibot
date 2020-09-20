export enum MidiInstrument {
    'PIANO' = 1,
    'GUITAR' = 25,
    'BASS' = 33,
    'STRINGS' = 49,
    'SYNTH' = 81,
}

export interface MidiNoteEvent {
    delta: number;
    key: number;
    velocity: number;
}

export interface MidiTrackModel {
    name?: string;
    instrument: MidiInstrument;
    channel: number;
    events: MidiNoteEvent[];
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
