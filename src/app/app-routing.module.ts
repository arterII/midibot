import {MidibotArrangerComponent} from "./pages/arranger/midibot-arranger.component";
import {RouterModule, Routes} from "@angular/router";
import {MidibotMainPageComponent} from "./pages/main-page/midibot-main-page.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MidibotPatternDemoComponent} from "./pages/pattern-demo/midibot-pattern-demo.component";
import {MidibotMixerComponent} from "./pages/mixer/midibot-mixer.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: MidibotMainPageComponent
    },
    {
        path: 'pattern',
        component: MidibotPatternDemoComponent,
    },
    {
        path: 'song',
        component: MidibotArrangerComponent,
    },
    {
        path: 'mixer',
        component: MidibotMixerComponent,
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
