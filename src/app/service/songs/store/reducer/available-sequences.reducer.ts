import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Sequence} from "../../../midibot/midibot.model";
import {initSampleSequencesAction, SequencesActions} from "../actions/available-sequences.actions";

export interface AvailableSequencesReducerState extends EntityState<Sequence> {
}

export const adapter: EntityAdapter<Sequence> = createEntityAdapter<Sequence>({
    selectId: (s: Sequence): string => s.id
});

const initialState: AvailableSequencesReducerState = {
    ...adapter.getInitialState(),
};

export function reducer(
    state = initialState,
    action: SequencesActions
): AvailableSequencesReducerState {
    switch (action.type) {
        case initSampleSequencesAction.type: {
            return adapter.upsertMany(action.sequences, state);
        }
        default: {
            return state;
        }
    }
}

