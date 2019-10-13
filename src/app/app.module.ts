import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PrihlasenieComponent } from './prihlasenie/prihlasenie.component';
import { UcastniciComponent } from './ucastnici/ucastnici.component';
import { UcastnikComponent } from './ucastnici/ucastnik/ucastnik.component';
import { KruzkyComponent } from './kruzky/kruzky.component';
import { KruzokComponent } from './kruzky/kruzok/kruzok.component';

@NgModule({
  declarations: [
    AppComponent,
    PrihlasenieComponent,
    UcastniciComponent,
    UcastnikComponent,
    KruzkyComponent,
    KruzokComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
