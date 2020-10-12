import {PATTERNS_FEATURE, reducers} from "./store/reducer";
import {StoreModule} from "@ngrx/store";
import {patternsEffects} from "./store/effects";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {EffectsModule} from "@ngrx/effects";
import {PatternsFacade} from "./facade/patterns-facade";

@NgModule({
    imports: [
        StoreModule.forFeature(PATTERNS_FEATURE, reducers),
        EffectsModule.forFeature([
            ...patternsEffects,
        ]),
    ]
})
export class PatternsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PatternsModule,
            providers: [
                PatternsFacade,
            ]
        };
    }
}
