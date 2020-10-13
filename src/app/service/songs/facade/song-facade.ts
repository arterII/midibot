import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {StateWithSongs} from '../store/reducer';
import {demoSequences, demoSongs} from "../../midibot/midibot.constants";
import {initSampleSequencesAction} from "../store/actions/available-sequences.actions";
import {initSampleSongsAction} from "../store/actions/available-songs.actions";


@Injectable()
export class SongFacade {

    constructor(
        private store: Store<StateWithSongs>,
    ) {
    }

    initSampleSongs() {
        this.store.dispatch(initSampleSequencesAction({sequences: demoSequences}));
        this.store.dispatch(initSampleSongsAction({songs: demoSongs}));
    }

}
