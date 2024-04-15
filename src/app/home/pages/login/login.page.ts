import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  togglePw: boolean = false
  loginForm: FormGroup
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [, Validators.required],
      password: [, Validators.required]
    })
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {

      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res);

          localStorage.setItem('userData', JSON.stringify(res.body.data))
          console.log(localStorage.getItem('userData'));
          
          this.auth.userData.set(res.body.data)
          this.router.navigate([''])
          

          
        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }
}
