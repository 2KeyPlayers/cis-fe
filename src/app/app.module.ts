import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { MiestaComponent } from './miesta/miesta.component';
import { MiestoComponent } from './miesta/miesto/miesto.component';
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
    UcastniciComponent,
    MiestoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
