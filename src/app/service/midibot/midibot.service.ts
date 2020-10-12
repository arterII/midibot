import {Injectable} from "@angular/core";
import {
    ChordPlay, ChordType,
    NoteLength,
    PatternChange,
    PatternSet,
    PatternSetPart,
    Pitch,
    PitchPart,
    Sequence,
    SequencePart,
    Song,
    SongData
} from "./midibot.model";
import {AbsoluteNoteEvent, MidiFileModel, MidiInstrument, MidiTrackModel} from "../midi-file/midi-file.model";
import {chordTypes, defaultMidiFileModel} from "./midibot.constants";

interface ChordAt {
    position: number,
    chord: ChordPlay
}

@Injectable()
export class MidibotService {

    createMidi(song: Song, data: SongData): MidiFileModel {
        const tracks: MidiTrackModel[] = this.createMidiTracks(song, data);
        const midi: MidiFileModel = {
            ...defaultMidiFileModel,
            tracks,
            numberOfTracks: tracks.length+1,
            speed: this.tempo2Speed(song.tempo)
        }
        return midi;
    }

    createMidiTracks(song: Song, data: SongData): MidiTrackModel[] {
        const ret: MidiTrackModel[] = [];
        let ticks = 0;
        song.sequenceIds.forEach(
            sequenceId => ticks = this.addSequenceToTracks(ticks, sequenceId, data, song.patternChanges, ret)
        );
        return ret;
    }

    addSequenceToTracks(ticks: number, sequenceId: string,
                        data: SongData, patternChanges: PatternChange[],
                        tracks: MidiTrackModel[]): number {
        const sequence = data.sequences.find( seq => seq.id === sequenceId);
        const chordsAt: ChordAt[] = [];
        let sequenceLength = 0;
        if(sequence) {
            sequenceLength = this.sequenceLength(sequence, data, chordsAt);
            //ToDo consider repetition index of he sequence to allow different patternSets for the same sequence
            const patternChange: PatternChange = patternChanges.find( patternChange => patternChange.sequenceId === sequence.id );
            const patternSet: PatternSet = data.patternSets.find( set => set.id === patternChange.patternSetId );
            if(patternSet) {
                patternSet.patterns.forEach( part => this.addPatternToTrack(ticks, part, patternSet.length, sequenceLength, tracks, chordsAt))
            }
        }
        console.log('ticks, chordsAt, tracks ', ticks, chordsAt, tracks);
        return ticks + sequenceLength;
    }

    addPatternToTrack(ticks: number, part: PatternSetPart, patternSetLength: number, sequenceLength: number, tracks: MidiTrackModel[], chordsAt: ChordAt[]) {
        const track: MidiTrackModel  = this.getOrCreateTrack(part, tracks);
        part.pattern.pitches.forEach(
            pitch => this.insertPitch(ticks, patternSetLength, sequenceLength, pitch, part, track, chordsAt)
        )
    }

    insertPitch(ticks: number, patternSetLength: number, sequenceLength: number, pitch: Pitch, part: PatternSetPart, track: MidiTrackModel, chordsAt: ChordAt[]) {
        let currentTick = ticks;
        const patternReps = patternSetLength / part.pattern.length;
        console.log('pattern reps', part.pattern.id, patternReps,part.pattern.pitches);
        const rep = pitch.repetitions ? pitch.repetitions : 1;
        while (currentTick < ticks + sequenceLength) {
            for(let i=0; i<patternReps; i++) {
                let ticksInside = currentTick;
                for (let j = 0; j < rep; j++) {
                    console.log('Insert Pitch.sequence', i, j, currentTick, pitch.sequence);
                    pitch.sequence.forEach(
                        pitchPart => ticksInside = this.insertPitchPart(ticksInside, ticks + sequenceLength, pitchPart, part, track, chordsAt)
                    )
                }
                currentTick += part.pattern.length;
            }
        }
    }

    insertPitchPart(ticks: number, ticksEnd: number, pitchPart: PitchPart, part: PatternSetPart, track: MidiTrackModel, chordsAt: ChordAt[]): number {
        const rep = pitchPart.repetitions ? pitchPart.repetitions : 1;
        for(let i= 0; i<rep; i++) {
            if( ticks+pitchPart.length <= ticksEnd) {
                const chord: ChordPlay = this.getChordAt(ticks, chordsAt);
                if(chord && pitchPart.index > -1) {
                    this.insertEvent(ticks, pitchPart, part, track, chord);
                }
                ticks+=pitchPart.length;
            } else {
                console.log('Ticks are more then sequence length', ticks, pitchPart.length, ticksEnd);
                break;
            }
        }
        return ticks;
    }

    getChordAt(ticks: number, chordsAt: ChordAt[]): ChordPlay {
        let ret: ChordPlay = null;
        for(let i=0; i<chordsAt.length; i++) {
            if(chordsAt[i].position <= ticks) {
                ret = chordsAt[i].chord;
            } else {
                break;
            }
        }
        return ret;
    }

    insertEvent(ticks: number, pitchPart: PitchPart, part: PatternSetPart, track: MidiTrackModel, chord: ChordPlay ) {
        const event: AbsoluteNoteEvent = {
            start: ticks,
            length: pitchPart.length,
            key: this.getKey(pitchPart, chord, part),
            velocity: pitchPart.velocity ? pitchPart.velocity : 100
        }
        if(!this.isEventPresent(event, track)) {
            track.absoluteEvents.push(event);
        }
    }

    isEventPresent(event: AbsoluteNoteEvent, track: MidiTrackModel): boolean {
        const ev = track.absoluteEvents.find( presentEvent =>
            presentEvent.start === event.start &&
            presentEvent.key === event.key
        );
        return ev !== undefined;
    }

    getKey(pitchPart: PitchPart, chord: ChordPlay, part: PatternSetPart): number {
        if(part.instrument === MidiInstrument.DRUMS) {
            return pitchPart.index
        }
        const octaveshift = pitchPart.deltaoctave ? pitchPart.deltaoctave : 0;
        const chordtype: ChordType = chordTypes.find( type => chord.chordType === type.id );
        let note = pitchPart.index;
        if(chordtype.levels.length-1 < pitchPart.index) {
            note = chordtype.levels[chordtype.levels.length-1];
        } else {
            if(chordtype.levels.length > 3 && pitchPart.index4) {
                note = chordtype.levels[pitchPart.index4];
            } else {
                note = chordtype.levels[pitchPart.index];
            }
        }
        return (part.octave+octaveshift)*12 + chord.level + note;
    }

    getOrCreateTrack(part: PatternSetPart, tracks: MidiTrackModel[]): MidiTrackModel {
        let ret: MidiTrackModel = tracks.find( track => track.instrument === part.instrument);
        if(!ret) {
            ret = {
              instrument: part.instrument,
              name: part.name,
              events: [],
              absoluteEvents: [],
              channel: part.instrument === MidiInstrument.DRUMS ? 9 : tracks.length < 9 ? tracks.length : tracks.length +1
            }
            tracks.push(ret);
        }
        return ret;
    }

    sequenceLength(sequence: Sequence, data: SongData, chordsAt: ChordAt[]): number {
        let ticks: number = 0;
        sequence.sequenceParts.forEach(
            part => ticks += this.partLength(part, data, chordsAt, ticks)
        );
        return ticks;
    }

    partLength(part: SequencePart, data: SongData, chordsAt: ChordAt[], ticks: number): number {
        let ret: number = 0;
        const rep = part.repetition ? part.repetition : 1;
        for(let i=0; i<rep; i++) {
            if (part.progressionId) {
                const prog = data.progressions.find( prog => prog.id === part.progressionId );
                if(prog) {
                    let proglength = 0;
                    prog.chords.forEach(
                        chord => {
                            chordsAt.push({position: ticks + ret + proglength, chord})
                            proglength += chord.length;
                        }
                    );
                    ret += proglength;
                }
            }
            if (part.chord) {
                chordsAt.push({position: ret + ticks, chord: part.chord})
                ret += part.chord.length * rep;
            }
        }
        return ret;
    }

    private tempo2Speed(tempo: number): number {
        return Math.round(60/tempo*1000000);
    }
}
