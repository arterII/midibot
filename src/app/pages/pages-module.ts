import {MidibotMainPageModule} from "./main-page/midibot-main-page.module";
import {NgModule} from "@angular/core";
import {MidibotArrangerModule} from "./arranger/midibot-arranger.module";
import {MidibotMixerModule} from "./mixer/midibot-mixer.module";
import {MidibotPatternDemoModule} from "./pattern-demo/midibot-pattern-demo.module";
import {PatternsModule} from "../service/patterns/patterns.module";

@NgModule({
    imports: [
        MidibotMainPageModule,
        MidibotArrangerModule,
        MidibotMixerModule,
        MidibotPatternDemoModule,
    ],
})
export class PagesModule { }
