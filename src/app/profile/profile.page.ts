import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { PasswordValidator } from '../password.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private config: ConfigService,
    public http: HttpClient,
  ) { }

  ngOnInit() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.validations_form = this.formBuilder.group({     
      matching_passwords: this.matching_passwords_group,
      oldpassword: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

    

  }

  validation_messages = {
    oldpassword: [
      { type: 'required', message: 'Old Password is required.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      // { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    confirm_password: [
      { type: 'required', message: 'Confirm password is required.' }
    ],
    matching_passwords: [
      { type: 'areEqual', message: 'Password mismatch.' }
    ] 
  };

  async onSubmit(values) {
    let passwordValues;

       passwordValues = {
          user_id : await this.storage.get("lsUserID"),
          oldpassword: values.oldpassword,
          newpassword: values.matching_passwords.password
        };

    let data: any;
    const url = this.config.domainURL + 'api/changepassword';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });
    data = this.http.post(url,passwordValues);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result); 

        if (result.status === "1") {
          this.presentToast(result.message);
          loading.dismiss();
          
        }
         else if (result.status === "0") {
          // alert("else");
          this.presentToast(result.message);
          loading.dismiss();
        } 

        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });

    this.validations_form.reset(); 

  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
