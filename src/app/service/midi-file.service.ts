import { Injectable } from "@angular/core";

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
}
