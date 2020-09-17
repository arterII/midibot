import { Injectable } from "@angular/core";
import {MidiFileModel} from "./midi-file.model";

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
        return new Blob([new Uint8Array(data)], {type: 'audio/midi'});
    }
}

