import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup
  togglePw: boolean = false

  email: any
  token: any
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.email = this.route.snapshot.paramMap.get('email')!;
    this.resetForm = this.fb.group({
      password: [, Validators.required]
    })


  }

  ngOnInit() {
  }

  reset() {
    if (this.resetForm.valid) {
      let obj = {
        email: this.email,
        token: this.token,
        password: this.resetForm.value.password
      }

      this.auth.resetPassword(obj).subscribe({
        next: (res: any) => {
          console.log(res);

          this.router.navigate(['login'])

        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }
} 
