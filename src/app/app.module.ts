import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MiestaComponent } from './miesta/miesta.component';
import { ZaujmoveUtvaryComponent } from './zaujmove-utvary/zaujmove-utvary.component';
import { VeduciComponent } from './veduci/veduci.component';
import { UcastniciComponent } from './ucastnici/ucastnici.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MiestaComponent,
    ZaujmoveUtvaryComponent,
    VeduciComponent,
    UcastniciComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
