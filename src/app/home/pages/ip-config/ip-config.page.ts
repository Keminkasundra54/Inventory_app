import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-ip-config',
  templateUrl: './ip-config.page.html',
  styleUrls: ['./ip-config.page.scss'],
})
export class IpConfigPage implements OnInit {
  ipForm:FormGroup
  constructor(private fb:FormBuilder , private auth:AuthService, private router:Router) {

    this.ipForm = this.fb.group({
      ipData:['http://192.168.1.13:8080/',Validators.required]
    })
    if(this.ipForm.valid){
      this.submit()
    }
   }

  ngOnInit() {
  }

  submit(){
    if(this.ipForm.valid){
      console.log(this.ipForm.value.ipData);
      
      this.auth.url.set(this.ipForm.value.ipData)

      this.router.navigate(['products'])
    }
  }
}
