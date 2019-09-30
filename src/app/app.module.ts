import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MiestaComponent } from './miesta/miesta.component';
import { MiestoComponent } from './miesta/miesto/miesto.component';
import { ZaujmoveUtvaryComponent } from './kruzky/kruzky.component';
import { ZaujmovyUtvarComponent } from './kruzky/zaujmovy-utvar/zaujmovy-utvar.component';
import { VeduciComponent } from './veduci/veduci.component';
import { VodcaComponent } from './veduci/vodca/vodca.component';
import { UcastniciComponent } from './ucastnici/ucastnici.component';
import { UcastnikComponent } from './ucastnici/ucastnik/ucastnik.component';
import { PrihlasenieComponent } from './prihlasenie/prihlasenie.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MiestaComponent,
    ZaujmoveUtvaryComponent,
    VeduciComponent,
    UcastniciComponent,
    MiestoComponent,
    VodcaComponent,
    ZaujmovyUtvarComponent,
    UcastnikComponent,
    PrihlasenieComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
