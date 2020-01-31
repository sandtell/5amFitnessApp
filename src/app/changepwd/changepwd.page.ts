import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { PasswordValidator } from '../password.validator';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-changepwd',
  templateUrl: './changepwd.page.html',
  styleUrls: ['./changepwd.page.scss'],
})
export class ChangepwdPage implements OnInit {
  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  public id;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private config: ConfigService,
    public http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

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

    console.log(values);

    let data: any;
    const url = this.config.domainURL + 'api/password_change';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });

    let passwordValues;

       passwordValues = {
          id : this.id,
          OTP: values.oldpassword,
          password: values.matching_passwords.password
        };

    data = this.http.post(url,passwordValues);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result); 

        console.log(result.data[0].id);

        if (result.status === "1") {          
         // this.router.navigateByUrl('changepwd');

         this.router.navigateByUrl(`/login`);

          this.presentToast(result.message);
          loading.dismiss();
        }
         else if (result.status === "0") {
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
