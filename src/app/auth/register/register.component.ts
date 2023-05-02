import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

export function passwordMatchesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get("password")?.value;
    const passwordConf = control.get("passwordConf")?.value;

    if (password && passwordConf && password !== passwordConf) {
      return {
        passwordsDontMatch: true
      }
    }

    return null;
  };
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  readonly DELAY = 50;

  registerForm = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(6)]),
    passwordConf: new FormControl("", [])
  },{ validators: passwordMatchesValidator() } )
  

  error: string = "";

  constructor(private auth: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    let { username, email, password } = this.registerForm.value; 

    if(email === null || email === undefined) email = "";
    if(password === null || password === undefined) password = "";
    if(username === null || username === undefined) username = "";

    this.auth.register(username, email, password)
    .subscribe({
      next : () => {
        this.userService.createUser();
        this.router.navigate(['/sigma-chart']);
      },
      error: (err) => {
        this.error = "Email already in use";
      }
    });
  }

  hasErrors(control: string) {
    const input = this.registerForm.get(control);
    if (input === null) {
      return false;
    }
    return input.invalid && input.errors && (input.dirty && input.touched);
  }

  hasError(control: string, error: string) {
    const input = this.registerForm.get(control);
    if (input === null) {
      return false;
    }
    return input.hasError(error);
  }
}
