import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Pattern, PatternSet} from "../../../midibot/midibot.model";
import {initDefaultPatternsAction, PatternsActions} from "../actions/available-patterns.actions";
import {initDefaultPatternSetsAction, PatternSetsActions} from "../actions/available-pattern-sets.actions";

export interface AvailablePatternSetsReducerState extends EntityState<PatternSet> {
}


export const adapter: EntityAdapter<PatternSet> = createEntityAdapter<PatternSet>({
    selectId: (p: PatternSet): string => p.id
});

const initialState: AvailablePatternSetsReducerState = {
    ...adapter.getInitialState(),
};


export function reducer(
    state = initialState,
    action: PatternSetsActions
): AvailablePatternSetsReducerState {
    switch (action.type) {
        case initDefaultPatternSetsAction.type: {
            return adapter.upsertMany(action.patternSets, state);
        }
        default: {
            return state;
        }
    }
}

