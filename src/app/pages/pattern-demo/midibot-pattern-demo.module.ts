import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MidibotPatternDemoComponent} from "./midibot-pattern-demo.component";
import {MidiFileServiceModule} from "../../service/midi-file/midi-file-service.module";
import {MidibotServiceModule} from "../../service/midibot/midibot-service.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatSliderModule} from "@angular/material/slider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        MidiFileServiceModule,
        MidibotServiceModule,
        RouterModule,
        MatSliderModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
    ],
  declarations: [MidibotPatternDemoComponent],
  exports: [
    MidibotPatternDemoComponent
  ],
})
export class MidibotPatternDemoModule { }
