import { Component, OnInit, effect } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: any
  userInfo: any = []
  link :any
  profileForm: FormGroup;
  // editMode: boolean = false;
  imageData: any
  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private actionSheetController: ActionSheetController,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: [, Validators.required],
      lastName: [, Validators.required],
      email: [, Validators.required],
      phone: [, Validators.required],
      gender: [, Validators.required],
      address: this.fb.array([])
    });

    effect(()=>{
      this.link =  this.auth.url()
    })
    // if (localStorage.getItem('userData')) {

    //   this.userId = JSON.parse(localStorage.getItem('userData')!)._id

    //   this.getProfile()
    // }

  }

  ngOnInit() {
    // console.log(this.auth.userData(), 'profile');

    // if (localStorage.getItem('userData')) {

    //   this.userId = JSON.parse(localStorage.getItem('userData')!)._id

    //   this.getProfile()
    // }

  }


  ionViewDidEnter() {
    if (localStorage.getItem('userData')) {

      this.userId = JSON.parse(localStorage.getItem('userData')!)._id

      this.getProfile()
    }
    // this.menuController.close()

  }
  // getProfile() {
  //   let obj = {
  //     userId: this.userId
  //   }
  //   this.profile.getProfile(obj).subscribe({
  //     next: (res: any) => {
  //       if (res) {
  //         this.userInfo = res.body.data
  //         console.log(this.userInfo);
  //         this.profileForm.patchValue(this.userInfo)

  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);

  //     }
  //   })
  // }
  getProfile() {
    if (localStorage.getItem('userData')) {
      this.userId = JSON.parse(localStorage.getItem('userData')!)._id;

      this.profile.getProfile({ userId: this.userId }).subscribe({
        next: (res: any) => {
          if (res) {
            this.userInfo = res.body.data;
            console.log(this.userInfo);
            if (this.userInfo.address.length) {

              this.populateAddressFormArray(this.userInfo.address);
            } else {
              this.addAddress()
            }
            this.profileForm.patchValue({
              firstName: this.userInfo.firstName,
              lastName: this.userInfo.lastName,
              email: this.userInfo.email,
              phone: this.userInfo.phone,
              gender: this.userInfo.gender
            });
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  populateAddressFormArray(addresses: any[]) {
    const addressArray = this.profileForm.get('address') as FormArray;
    addressArray.clear(); // Clear existing addresses
    console.log(addresses);

    addresses.forEach(address => {

      addressArray.push(this.fb.group({
        apartment: [address.apartment || '', Validators.required],
        address: [address.address || '', Validators.required],
        city: [address.city || '', Validators.required],
        state: [address.state || '', Validators.required],
        country: [address.country || '', Validators.required],
        zip: [address.zip || '', Validators.required]
      }));
    });

  }
  initAddress() {
    return this.fb.group({
      apartment: [, Validators.required],
      address: [, Validators.required],
      city: [, Validators.required],
      state: [, Validators.required],
      country: [, Validators.required],
      zip: [, Validators.required]
    });
  }

  addAddress() {
    const addressArray = this.profileForm.get('address') as FormArray;
    addressArray.push(this.initAddress());
  }
  getAddressControls() {
    return (this.profileForm.get('address') as FormArray).controls;
  }
  removeAddress(index: number) {
    if (this.userInfo.address[index] && this.userInfo.address[index]._id) {

      let obj = {
        addressId: this.userInfo.address[index]._id
      }
      this.profile.removeAddress(obj).subscribe({
        next: (res: any) => {
          if (res) {
            this.getProfile()
          }
        }, error: (err) => {
          console.error(err);

        }
      })
    } else {
      const addressArray = this.profileForm.get('address') as FormArray;
      addressArray.removeAt(index)
    }
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          icon: 'camera',
          text: 'Camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          icon: 'trash',
          text: 'Remove Profile',
          handler: () => {
            this.removeProfile()
          }
        },
        {
          icon: 'close',
          text: 'Cancel',
          role: 'cancel',

          handler: () => {

          }
        }
      ]
    });

    await actionSheet.present();
  }
  submit() {
    console.log(this.profileForm.value);
    let formData = new FormData()

    if (this.imageData) {
      formData.append('profilePic', this.imageData)
    }
    formData.append('userId', this.userId)
    let newData = this.profileForm.value
    console.log(newData);
    if(this.profileForm.valid){

      newData.address.forEach((add: any, index: number) => {
        if (this.userInfo.address[index] && this.userInfo.address[index]._id) {
          add._id = this.userInfo.address[index]._id;
        } else {
          add._id = null;
        }
      });
      formData.append('formData', JSON.stringify(newData))
  
  
      this.profile.updateProfile(formData).subscribe({
        next: (res: any) => {
          if (res) {
            this.getProfile()
          }
        },
        error: (err) => {
          console.error(err);
  
        }
      })
    }
  }
  // async takePicture() {
  //   try {
  //     const permissionStatus = await Camera.checkPermissions();
  //     console.log(permissionStatus);

  //     if (permissionStatus.photos !== "granted" || permissionStatus.camera !== "granted") {
  //       const reqStatus = await Camera.requestPermissions();
  //       if (reqStatus.photos !== "granted" || reqStatus.camera !== "granted") {
  //         // await this.openSettingCamera(true);
  //         return;
  //       }
  //     }

  //     const image: any = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: false,
  //       // resultType: CameraResultType.DataUrl,
  //       resultType:CameraResultType.Uri,
  //       source: CameraSource.Prompt,
  //     });

  //     if (image) {
  //       console.log(image);
  //       this.imageData = image
  //       // let img = await this.user.updateDocument(`users/${this.id}`, {
  //       //   photo: image
  //       // });
  //       // this.profile()

  //       // console.log({ img });

  //     } else {
  //       console.error('Failed to save the photo to disk.');
  //       alert('Failed to save the photo to disk.');
  //     }
  //   } catch (error) {
  //     console.error('Error capturing and sending image:', error);
  //     alert(error);
  //   }
  // }
  async takePicture() {
    try {
      const permissionStatus = await Camera.checkPermissions();
      console.log(permissionStatus);

      if (permissionStatus.photos !== "granted" || permissionStatus.camera !== "granted") {
        const reqStatus = await Camera.requestPermissions();
        if (reqStatus.photos !== "granted" || reqStatus.camera !== "granted") {
          // await this.openSettingCamera(true);
          return;
        }
      }

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });

      if (photo && photo.webPath) {
        let blob = await fetch(photo.webPath).then(r => r.blob());
        console.log(blob);

        this.imageData = new File([blob], `${new Date().getTime()} -my_image.jpeg`, {
          type: "image/jpeg",
          lastModified: Number(new Date()),
          // size: blob.size,
        });


      }
      // if (photo && photo.path && photo.webPath) {
      //   console.log(photo);

      //   const imageName = photo.path.substr(photo.path.lastIndexOf('/') + 1);

      //   // Convert Photo object to a blob
      //   const response = await fetch(photo.webPath);
      //   const blob = await response.blob();
      //   console.log(blob);

      //   // Send file data along with its name
      //   // Replace the following line with your method to send the file data
      // } else {
      //   console.error('Failed to save the photo to disk.');
      //   alert('Failed to save the photo to disk.');
      // }
    } catch (error) {
      console.error('Error capturing and sending image:', error);
      alert(error);
    }
  }
  // openSettingCamera(app = false) {
  //   console.log('open settings...');
  //   return NativeSettings.open({
  //     optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Storage,
  //     optionIOS: app ? IOSSettings.App : IOSSettings.Store
  //   })

  // }

  async removeProfile() {
    console.log(this.userInfo);
    let obj = {
      userId: this.userId,
      imageUrl: this.userInfo.profilePic[0]
    }

    this.profile.removeUserImage(obj).subscribe({
      next: (res: any) => {
        if (res) {
          this.getProfile()
        }
      },
      error: (err) => {
        console.error(err);

      }
    })
    // let img = await this.user.updateDocument(`users/${this.id}`, {

    // });
    // this.profile()
    // console.log({ img });

  }
}
