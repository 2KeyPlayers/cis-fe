import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './menu/menu.component';

import { MiestaComponent } from './miesta/miesta.component';
import { MiestoComponent } from './miesta/miesto/miesto.component';

import { VeduciComponent } from './veduci/veduci.component';
import { VodcaComponent } from './veduci/vodca/vodca.component';

import { ZaujmoveUtvaryComponent } from './zaujmove-utvary/zaujmove-utvary.component';
import { ZaujmovyUtvarComponent } from './zaujmove-utvary/zaujmovy-utvar/zaujmovy-utvar.component';

import { UcastniciComponent } from './ucastnici/ucastnici.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'menu',                  component: MenuComponent },
  { path: 'ucastnici',             component: UcastniciComponent },
  // { path: 'ucastnik/:id',          component: UcastnikComponent },
  { path: 'zaujmove-utvary',       component: ZaujmoveUtvaryComponent },
  { path: 'zaujmovy-utvar/:id',    component: ZaujmovyUtvarComponent },
  { path: 'veduci',                component: VeduciComponent },
  { path: 'veduci/:id',            component: VodcaComponent },
  { path: 'miesta',                component: MiestaComponent },
  { path: 'miesto/:id',            component: MiestoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
