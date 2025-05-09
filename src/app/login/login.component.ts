import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../app.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;
  username = '';
  password = '';
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService, private router: Router, private formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  onFormSubmit(): void {
    this.isLoadingResults = true;
    this.authService.login(this.loginForm.value)
      .subscribe(() => {
        this.isLoadingResults = false;
        this.router.navigate(['/secure']).then(_ => console.log('You are secure now!'));
      }, (err: any) => {
        console.log(err);
        this.isLoadingResults = false;
      });
  }

}
