import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateWithPatterns } from '../store/reducer';
import {initDefaultPatternsAction} from "../store/actions/available-patterns.actions";
import {defaultPatterns, defaultPatternSets, sampleProgressions} from "../../midibot/midibot.constants";
import {selectAllAvailablePatterns} from "../store/selectors/available-patterns.selector";
import {initDefaultPatternSetsAction} from "../store/actions/available-pattern-sets.actions";
import {selectAllAvailablePatternSets} from "../store/selectors/available-pattern-sets.selector";
import {selectAllAvailableChordProgressions} from "../store/selectors/available-chord-progressions.selector";
import {initSampleChordProgressionsAction} from "../store/actions/available-chord-progressions.actions";


@Injectable()
export class PatternsFacade {

    constructor(
        private store: Store<StateWithPatterns>,
    ) {
    }

    availablePatterns$ = this.store.select(selectAllAvailablePatterns);
    availablePatternSets$ = this.store.select(selectAllAvailablePatternSets);
    availableChordProgressions$ = this.store.select(selectAllAvailableChordProgressions);

    initDefaultPatterns() {
        this.store.dispatch(initDefaultPatternsAction({patterns: defaultPatterns}));
        this.store.dispatch(initDefaultPatternSetsAction({patternSets: defaultPatternSets}));
        this.store.dispatch(initSampleChordProgressionsAction({progressions: sampleProgressions}));
    }

}
