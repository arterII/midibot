import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import {PagesModule} from "./pages/pages-module";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {PatternsModule} from "./service/patterns/patterns.module";


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    AppRoutingModule,
    PagesModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictStateSerializability: true,
        strictActionImmutability: true,
        // strictActionSerializability: true, // @todo would we like to enable this? If yes we can't pass JS Error objects into actions.
      },
      //metaReducers: [localStorageSyncReducer, localStorageSyncReducerCache],
    }),
    StoreDevtoolsModule.instrument({
      name: 'Midibot Store',
      logOnly: false
    }),
    EffectsModule.forRoot([]),
    PatternsModule.forRoot()
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
})
export class AppModule { }
