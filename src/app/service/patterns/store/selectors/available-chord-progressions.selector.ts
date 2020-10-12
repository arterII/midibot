import * as fromAvailableChordProgressions from '../reducer/available-chord-progressions.reducer';
import {createSelector, MemoizedSelector} from "@ngrx/store";
import {selectPatternsState} from "../reducer";
import {Dictionary} from "@ngrx/entity";
import {Progression} from "../../../midibot/midibot.model";

const { selectEntities, selectAll } = fromAvailableChordProgressions.adapter.getSelectors();

export const getAvailableChordProgressionsState = createSelector(
    selectPatternsState,
    state => state['available-chord-progressions']
);

export const selectAvailableChordProgressionsEntities: MemoizedSelector<any, Dictionary<Progression>> = createSelector(
    getAvailableChordProgressionsState,
    selectEntities,
);

export const selectAllAvailableChordProgressions: MemoizedSelector<any, Progression[]> = createSelector(
    getAvailableChordProgressionsState,
    selectAll,
);

