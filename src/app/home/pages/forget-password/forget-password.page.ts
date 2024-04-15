import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  forgotForm: FormGroup
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {

    this.forgotForm = this.fb.group({
      email: [, Validators.required]
    })
  }

  ngOnInit() {
  }

  forgot() {
    if(this.forgotForm.valid){
      this.auth.forgotPassword(this.forgotForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.router.navigate([''])
        },
        error: (err) => {
          console.error(err);

        }
      })
    }
  }
}
