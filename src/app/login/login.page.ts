import { Component, OnInit } from "@angular/core";
import { NavController, MenuController, LoadingController, ToastController, Platform } from "@ionic/angular";
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private config:ConfigService,
    public http: HttpClient,
    public platform: Platform,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      mobileNo : new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),     
    });
  }

  openPage(page: any) {
    this.navCtrl.navigateForward(page);
  }

  validation_messages = {
    mobileNo : [
      { type: 'required', message: 'Mobile number is required.' },
      { type: 'minlength', message: 'Mobile No must be at least 10' },
      { type: 'maxlength', message: 'Mobile No cannot be more than 10' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
    ],
    
  };

  async onSubmit(values){

    let data: any;
    const url = this.config.domainURL + 'api/login';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });
    data = this.http.post(url,values);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result); 

        if (result.status === "1") {
          this.authService.login()
          localStorage.setItem('localUserName',result.data[0].name);

          this.storage.set('lsUserID', result.data[0].id);
          this.storage.set('lsUserName', result.data[0].name);
          this.storage.set('lsEmail',  result.data[0].email);
          this.storage.set('lsPassword', result.data[0].password);
          this.storage.set('lsMobileNo',  result.data[0].mobile);
          this.storage.set('lsRelative',  result.data[0].relative_name);
          this.storage.set('lsMemberCategory',  result.data[0].category);
          this.storage.set('lsCategory',  result.data[0].category);
          this.storage.set('lsChapter', result.data[0].chapter_type);
          
         //this.router.navigateByUrl('/tabs');
         this.router.navigateByUrl('tabs');

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
      duration: 2000,
      showCloseButton : true,
    });
    toast.present();
  }

}
