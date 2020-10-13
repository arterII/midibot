import * as fromAvailableSongs from './available-songs.reducer';
import * as fromAvailableSequences from './available-sequences.reducer';
import {ActionReducerMap, createFeatureSelector} from "@ngrx/store";

export const SONGS_FEATURE = 'Songs';

export interface StateWithSongs {
    [SONGS_FEATURE]: SongsState;
}

export interface SongsState {
    'available-songs': fromAvailableSongs.AvailableSongsReducerState;
    'available-sequences': fromAvailableSequences.AvailableSequencesReducerState;
}

export const reducers: ActionReducerMap<SongsState, any> = {
    'available-songs': fromAvailableSongs.reducer,
    'available-sequences': fromAvailableSequences.reducer
};

export const selectSongsState = createFeatureSelector<StateWithSongs, SongsState>(
    SONGS_FEATURE
);
