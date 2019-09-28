import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { MenuComponent } from './menu/menu.component';
import { PrihlasenieComponent } from './prihlasenie/prihlasenie.component';

import { MiestaComponent } from './miesta/miesta.component';
import { MiestoComponent } from './miesta/miesto/miesto.component';

import { VeduciComponent } from './veduci/veduci.component';
import { VodcaComponent } from './veduci/vodca/vodca.component';

import { ZaujmoveUtvaryComponent } from './zaujmove-utvary/zaujmove-utvary.component';
import { ZaujmovyUtvarComponent } from './zaujmove-utvary/zaujmovy-utvar/zaujmovy-utvar.component';

import { UcastniciComponent } from './ucastnici/ucastnici.component';
import { UcastnikComponent } from './ucastnici/ucastnik/ucastnik.component';

const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'prihlasenie',          component: PrihlasenieComponent },
  // { path: 'heslo/zmena',          component: HesloZmenaComponent },
  // { path: 'heslo/obnova',         component: HesloObnovaComponent },
  { path: 'menu',                 component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'ucastnici',            component: UcastniciComponent, canActivate: [AuthGuard] },
  { path: 'ucastnik/:id',         component: UcastnikComponent, canActivate: [AuthGuard] },
  { path: 'zaujmove-utvary',      component: ZaujmoveUtvaryComponent, canActivate: [AuthGuard] },
  { path: 'zaujmovy-utvar/:id',   component: ZaujmovyUtvarComponent, canActivate: [AuthGuard] },
  { path: 'veduci',               component: VeduciComponent, canActivate: [AuthGuard] },
  { path: 'veduci/:id',           component: VodcaComponent, canActivate: [AuthGuard] },
  { path: 'miesta',               component: MiestaComponent, canActivate: [AuthGuard] },
  { path: 'miesto/:id',           component: MiestoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
