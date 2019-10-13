import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { PrihlasenieComponent } from './prihlasenie/prihlasenie.component';

import { KruzkyComponent } from './kruzky/kruzky.component';
import { KruzokComponent } from './kruzky/kruzok/kruzok.component';

import { UcastniciComponent } from './ucastnici/ucastnici.component';
import { UcastnikComponent } from './ucastnici/ucastnik/ucastnik.component';

const routes: Routes = [
  { path: '', redirectTo: 'ucastnici', pathMatch: 'full' },
  { path: 'prihlasenie',  component: PrihlasenieComponent },
  // { path: 'heslo/zmena',  component: HesloZmenaComponent, canActivate: [AuthGuard] },
  // { path: 'heslo/obnova', component: HesloObnovaComponent, canActivate: [AuthGuard] },
  { path: 'ucastnici',    component: UcastniciComponent, canActivate: [AuthGuard] },
  { path: 'ucastnik/:id', component: UcastnikComponent, canActivate: [AuthGuard] },
  { path: 'kruzky',       component: KruzkyComponent, canActivate: [AuthGuard] },
  { path: 'kruzok/:id',   component: KruzokComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
