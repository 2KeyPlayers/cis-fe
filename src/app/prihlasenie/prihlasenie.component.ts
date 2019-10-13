import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-prihlasenie',
  templateUrl: './prihlasenie.component.html',
  styleUrls: ['./prihlasenie.component.scss']
})
export class PrihlasenieComponent extends BaseComponent implements OnInit {
  formular: FormGroup;
  submitnuty: boolean;

  constructor(protected fb: FormBuilder, protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle(null, null);

    this.formular = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      heslo: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.initData();
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    return '';
  }

  prihlasit() {
    this.submitnuty = true;
    if (this.formular.valid) {
      this.log('prihlasujem...');
      this.dataService
        .prihlasenie(this.f.email.value, this.f.heslo.value)
        .then(authedUser => {
          console.log(`uzivatel uspesne prihlaseny: ${authedUser.id}`);
          this.router.navigate(['/menu']);
        })
        .catch(err => {
          console.error(`prihlasenie zlyhalo: ${err}`);
          this.formular.setErrors({ neplatnaKombinacia: true });
        });
    }
  }

  obnovitHeslo(): void {
    this.router.navigate(['/heslo/obnova']);
  }
}
