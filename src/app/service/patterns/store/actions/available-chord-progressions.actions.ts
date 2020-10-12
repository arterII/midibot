import {createAction, props, union} from "@ngrx/store";
import {PatternSet, Progression} from "../../../midibot/midibot.model";

export const initSampleChordProgressionsAction = createAction(
    '[ChordProgression] Init Sample Chord Progressions',
    props<{progressions: Progression[]}>()
);

const allActions = union({
    initSampleChordProgressionsAction,
});

export type ChordProgressionsActions = typeof allActions;
