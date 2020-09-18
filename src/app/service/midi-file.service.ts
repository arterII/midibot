import { Injectable } from "@angular/core";
import {MidiFileModel, TimeSignature} from "./midi-file.model";

@Injectable()
export class MidiFileService {

    intToOctets(intValue: number, radix: number, length): number[] {
        const mask = 2**radix-1;
        const octets: number[] = [];
        octets.length = length;
        octets.fill(0);
        let indx= 0;
        for(let i = intValue; i != 0; i>>>=radix) {
            octets[indx++] = i & mask;
        }
        return octets.reverse();
    }

    encodeVLQ7(intValue: number): number[] {
        const octets = this.intToOctets(intValue, 7, 1);
        return octets.map((val, index) => index == octets.length-1 ? val : val+=128);
    }

    stringToChars(strValue: string): number[] {
        const strArr = strValue.split('');
        return strArr.map( c => c.charCodeAt(0));
    }

    createChunk(mark: string, data: number[]): number[] {
        const chunk: number[] = [];
        chunk.push(...this.stringToChars(mark));
        chunk.push(...this.intToOctets(data.length, 8, 4))
        chunk.push(...data);
        return chunk;
    }

    createTextEvent(textType: number, text: string): number[] {
        const data: number[] = [];
        //Event without delta time
        data.push(0);
        //Meta event
        data.push(0xff);
        data.push(textType);
        data.push(text.length);
        data.push(...this.stringToChars(text));
        return data;
    }

    createTimeSignature(timeSignature: TimeSignature) {
        const data: number[] = [];
        //Event without delta time
        data.push(0);
        //Meta event
        data.push(0xff);
        data.push(0x58);
        data.push(4);
        data.push(timeSignature.numerator);
        data.push(timeSignature.denominator);
        data.push(timeSignature.metronomeTicks);
        data.push(timeSignature.note32ndToQuarter);
        return data;
    }

    createTempo(mysPerQuarter: number) {
        const data: number[] = [];
        //Event without delta time
        data.push(0);
        //Meta event
        data.push(0xff);
        data.push(0x51);
        data.push(3);
        data.push(...this.intToOctets(mysPerQuarter, 8, 3));
        return data;
    }

    createMidiTrack(data: number[]) {
        //Event without delta time
        data.push(0);
        //Meta event
        data.push(0xff);
        //Track End Event
        data.push(0x2f, 0);
        return this.createChunk('Mtrk', data);
    }

    createMetaTrack(midiFileModel: MidiFileModel): number[] {
        const data: number[] = [];
        if(midiFileModel.name) {
            data.push(...this.createTextEvent(3, midiFileModel.name));
        }
        if(midiFileModel.timeSignature) {
            data.push(...this.createTimeSignature(midiFileModel.timeSignature))
        }
        if(midiFileModel.speed) {
            data.push(...this.createTempo(midiFileModel.speed));
        }
        return this.createMidiTrack(data);
    }

    createMidiFileHeader(midiFileModel: MidiFileModel): number[] {
        const data: number[] = [];
        data.push(...this.intToOctets(midiFileModel.format, 8, 2));
        data.push(...this.intToOctets(midiFileModel.numberOfTracks, 8, 2));
        data.push(...this.intToOctets(midiFileModel.deltaTimeTicks, 8, 2));
        return this.createChunk('MThd',data);
    }

    createMidiFile(midiFileModel: MidiFileModel): Blob {
        const data: number[] = [];
        data.push(...this.createMidiFileHeader(midiFileModel));
        data.push(...this.createMetaTrack(midiFileModel));
        return new Blob([new Uint8Array(data)], {type: 'audio/midi'});
    }
}

