import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {
  proccesing: boolean = false
  constructor(private route: ActivatedRoute, private auth: AuthService) {
    let token: string = this.route.snapshot.paramMap.get('token')!;
    let email: string = this.route.snapshot.paramMap.get('email')!;
    console.log(token);
    this.auth.token = token
    let obj = {
      token,
      email
    }
    this.auth.emailConfirmation(obj).subscribe({
      next: (res) => {
        console.log(res);
        this.proccesing = true
      },
      error: (err) => {
        console.error(err);

      }
    })
  }

  ngOnInit() {
  }


}
