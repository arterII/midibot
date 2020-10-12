import {createAction, props, union} from "@ngrx/store";
import {Pattern} from "../../../midibot/midibot.model";

export const initDefaultPatternsAction = createAction(
    '[Patterns] Init Default Patterns',
    props<{patterns: Pattern[]}>()
);

const allActions = union({
    initDefaultPatternsAction,
});

export type PatternsActions = typeof allActions;
