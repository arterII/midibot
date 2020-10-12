import {createAction, props, union} from "@ngrx/store";
import {Pattern, PatternSet} from "../../../midibot/midibot.model";

export const initDefaultPatternSetsAction = createAction(
    '[PatternSets] Init Default Pattern sets',
    props<{patternSets: PatternSet[]}>()
);

const allActions = union({
    initDefaultPatternSetsAction,
});

export type PatternSetsActions = typeof allActions;
