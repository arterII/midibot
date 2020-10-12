import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {PatternSet, Progression} from "../../../midibot/midibot.model";
import {initDefaultPatternSetsAction, PatternSetsActions} from "../actions/available-pattern-sets.actions";
import {
    ChordProgressionsActions,
    initSampleChordProgressionsAction
} from "../actions/available-chord-progressions.actions";

export interface AvailableChordProgressionsReducerState extends EntityState<Progression> {
}


export const adapter: EntityAdapter<Progression> = createEntityAdapter<Progression>({
    selectId: (p: Progression): string => p.id
});

const initialState: AvailableChordProgressionsReducerState = {
    ...adapter.getInitialState(),
};


export function reducer(
    state = initialState,
    action: ChordProgressionsActions
): AvailableChordProgressionsReducerState {
    switch (action.type) {
        case initSampleChordProgressionsAction.type: {
            return adapter.upsertMany(action.progressions, state);
        }
        default: {
            return state;
        }
    }
}

