import * as fromAvailablePatterns from './available-patterns.reducer';
import * as fromAvailablePatternSets from './available-pattern-sets.reducer';
import * as fromAvailableChordProgressions from './available-chord-progressions.reducer';
import {ActionReducerMap, createFeatureSelector} from "@ngrx/store";

export const PATTERNS_FEATURE = 'Patterns';

export interface StateWithPatterns {
    [PATTERNS_FEATURE]: PatternsState;
}

export interface PatternsState {
    'available-patterns': fromAvailablePatterns.AvailablePatternsReducerState;
    'available-pattern-sets': fromAvailablePatternSets.AvailablePatternSetsReducerState;
    'available-chord-progressions': fromAvailableChordProgressions.AvailableChordProgressionsReducerState
}

export const reducers: ActionReducerMap<PatternsState, any> = {
    'available-patterns': fromAvailablePatterns.reducer,
    'available-pattern-sets': fromAvailablePatternSets.reducer,
    'available-chord-progressions': fromAvailableChordProgressions.reducer
};

export const selectPatternsState = createFeatureSelector<StateWithPatterns, PatternsState>(
    PATTERNS_FEATURE
);
