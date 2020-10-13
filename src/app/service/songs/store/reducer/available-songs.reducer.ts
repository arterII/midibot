import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Song} from "../../../midibot/midibot.model";
import {initSampleSongsAction, SongsActions} from "../actions/available-songs.actions";

export interface AvailableSongsReducerState extends EntityState<Song> {
}

export const adapter: EntityAdapter<Song> = createEntityAdapter<Song>({
    selectId: (s: Song): string => s.id
});

const initialState: AvailableSongsReducerState = {
    ...adapter.getInitialState(),
};

export function reducer(
    state = initialState,
    action: SongsActions
): AvailableSongsReducerState {
    switch (action.type) {
        case initSampleSongsAction.type: {
            return adapter.upsertMany(action.songs, state);
        }
        default: {
            return state;
        }
    }
}

