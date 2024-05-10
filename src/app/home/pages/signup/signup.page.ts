import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  togglePw: boolean = false
  signupForm: FormGroup
  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) {

    this.signupForm = this.fb.group({
      firstName: [, Validators.required],
      lastName: [, Validators.required],
      email: [, Validators.required],
      phone: [, Validators.required],
      password: [, Validators.required]
    })
  }

  ngOnInit() {
  }

  signup() {
    if (this.signupForm.valid) {

      this.auth.signup(this.signupForm.value).subscribe({
        next: (res: any) => {
          if (res) {

            this.router.navigate([''])
          }
        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }
} 
