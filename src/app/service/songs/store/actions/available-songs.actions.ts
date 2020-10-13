import {createAction, props, union} from "@ngrx/store";
import {Pattern, Song} from "../../../midibot/midibot.model";

export const initSampleSongsAction = createAction(
    '[Songs] Init Sample Songs',
    props<{songs: Song[]}>()
);

const allActions = union({
    initSampleSongsAction,
});

export type SongsActions = typeof allActions;
