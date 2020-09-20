import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MidibotArrangerModule} from "./components/midibot-arranger/midibot-arranger.module";


@NgModule({
  imports: [BrowserModule, FormsModule, MidibotArrangerModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
})
export class AppModule { }
