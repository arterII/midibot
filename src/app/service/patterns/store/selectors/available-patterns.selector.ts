import {createSelector, MemoizedSelector} from "@ngrx/store";
import {selectPatternsState} from "../reducer";
import {Dictionary} from "@ngrx/entity";
import {Pattern} from "../../../midibot/midibot.model";

import * as fromAvailablePatterns from '../reducer/available-patterns.reducer';

const { selectEntities, selectAll } = fromAvailablePatterns.adapter.getSelectors();

export const getAvailablePatternsState = createSelector(
    selectPatternsState,
    state => state['available-patterns']
);

export const selectAvailablePatternsEntities: MemoizedSelector<any, Dictionary<Pattern>> = createSelector(
    getAvailablePatternsState,
    selectEntities,
);

export const selectAllAvailablePatterns: MemoizedSelector<any, Pattern[]> = createSelector(
    getAvailablePatternsState,
    selectAll,
);

