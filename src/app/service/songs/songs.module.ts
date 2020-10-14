import {reducers, SONGS_FEATURE} from "./store/reducer";
import {StoreModule} from "@ngrx/store";
import {ModuleWithProviders, NgModule} from "@angular/core";
import {EffectsModule} from "@ngrx/effects";
import {SongFacade} from "./facade/song-facade";

@NgModule({
    imports: [
        StoreModule.forFeature(SONGS_FEATURE, reducers),
        EffectsModule.forFeature([
        ]),
    ]
})
export class SongsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SongsModule,
            providers: [
                SongFacade,
            ]
        };
    }
}
