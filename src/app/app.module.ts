import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MiestaComponent } from './miesta/miesta.component';
import { MiestoComponent } from './miesta/miesto/miesto.component';
import { ZaujmoveUtvaryComponent } from './zaujmove-utvary/zaujmove-utvary.component';
import { ZaujmovyUtvarComponent } from './zaujmove-utvary/zaujmovy-utvar/zaujmovy-utvar.component';
import { VeduciComponent } from './veduci/veduci.component';
import { VodcaComponent } from './veduci/vodca/vodca.component';
import { UcastniciComponent } from './ucastnici/ucastnici.component';
import { UcastnikComponent } from './ucastnici/ucastnik/ucastnik.component';

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
    UcastnikComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
