import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Pattern} from "../../../midibot/midibot.model";
import {initDefaultPatternsAction, PatternsActions} from "../actions/available-patterns.actions";

export interface AvailablePatternsReducerState extends EntityState<Pattern> {
}


export const adapter: EntityAdapter<Pattern> = createEntityAdapter<Pattern>({
    selectId: (p: Pattern): string => p.id
});

const initialState: AvailablePatternsReducerState = {
    ...adapter.getInitialState(),
};


export function reducer(
    state = initialState,
    action: PatternsActions
): AvailablePatternsReducerState {
    switch (action.type) {
        case initDefaultPatternsAction.type: {
            return adapter.upsertMany(action.patterns, state);
        }
        default: {
            return state;
        }
    }
}

