import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.page.html',
  styleUrls: ['./forgotpwd.page.scss'],
})
export class ForgotpwdPage implements OnInit {
  validations_form: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private config:ConfigService,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private router: Router,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      mobileNo : new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      
    });
  }

  validation_messages = {
    mobileNo : [
      { type: 'required', message: 'Mobile number is required.' },
      { type: 'minlength', message: 'Mobile No must be at least 10' },
      { type: 'maxlength', message: 'Mobile No cannot be more than 10' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ]    
  };

  async onSubmit(values){

    console.log(values);

    // this.router.navigateByUrl('changepwd');
    let data: any;
    const url = this.config.domainURL + 'api/forget_password';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });
    data = this.http.post(url,values);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result); 

        console.log(result.data[0].id);

        if (result.success === "1") {          
         // this.router.navigateByUrl('changepwd');

         this.router.navigateByUrl(`changepwd/${result.data[0].id}`);

          this.presentToast(result.message);
          loading.dismiss();
        }
         else if (result.status === "0") {
          this.presentToast(result.message);
          loading.dismiss();
        } 


        setTimeout(() => {
          loading.dismiss();
        }, 6000);

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
