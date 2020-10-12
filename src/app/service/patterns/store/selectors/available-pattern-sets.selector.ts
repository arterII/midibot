import {createSelector, MemoizedSelector} from "@ngrx/store";
import {selectPatternsState} from "../reducer";
import {Dictionary} from "@ngrx/entity";
import {Pattern, PatternSet} from "../../../midibot/midibot.model";

import * as fromAvailablePatternSets from '../reducer/available-pattern-sets.reducer';

const { selectEntities, selectAll } = fromAvailablePatternSets.adapter.getSelectors();

export const getAvailablePatternSetsState = createSelector(
    selectPatternsState,
    state => state['available-pattern-sets']
);

export const selectAvailablePatternSetsEntities: MemoizedSelector<any, Dictionary<PatternSet>> = createSelector(
    getAvailablePatternSetsState,
    selectEntities,
);

export const selectAllAvailablePatternSets: MemoizedSelector<any, PatternSet[]> = createSelector(
    getAvailablePatternSetsState,
    selectAll,
);

