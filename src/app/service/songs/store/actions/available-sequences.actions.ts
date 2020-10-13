import {createAction, props, union} from "@ngrx/store";
import {Pattern, Sequence, Song} from "../../../midibot/midibot.model";

export const initSampleSequencesAction = createAction(
    '[Sequences] Init Sample Sequences',
    props<{sequences: Sequence[]}>()
);

const allActions = union({
    initSampleSequencesAction,
});

export type SequencesActions = typeof allActions;
