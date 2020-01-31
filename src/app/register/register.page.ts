import { Component, OnInit , ViewEncapsulation  } from "@angular/core";
import { NavController, MenuController, LoadingController, ToastController,AlertController  } from "@ionic/angular";
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  // matching_passwords_group: FormGroup;
  public chapterJson: any;
  public isHideMember:boolean = false;
 
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    public formBuilder: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private router: Router,
    private config:ConfigService,
    public http: HttpClient,
  ) {

    this.getChapter()

  }

  ngOnInit() { 

    

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$')
      ])),

      weight: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ])),
      
      relative: new FormControl(''),
      category: new FormControl(''),
      // chapter: new FormControl(''),

      chapter: new FormControl('', Validators.required),

      // memberCategory: new FormControl(''),
      memberName: new FormControl('',Validators.compose([
        Validators.pattern('^[a-zA-Z]+$')
      ])),

      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      mobileNo : new FormControl('', Validators.compose([
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$')
      ]))
    });

  }

  validation_messages = {
    username: [
      { type: 'required', message: 'Name is required.' },
      { type: 'pattern', message: 'Number are not allowed' }
    ],

    memberName :[
      { type: 'pattern', message: 'Numbers are not allowed' }
    ],

    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    mobileNo : [
      { type: 'required', message: 'Mobile number is required.' },
      { type: 'minlength', message: 'Mobile No must be at least 10' },
      { type: 'maxlength', message: 'Mobile No cannot be more than 10' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ],
    weight : [
      { type: 'required', message: 'weight is required.' },
      { type: 'pattern', message: 'Chapter are not allowed' }
    ]
  };

  async onSubmit(values) { 
    // console.log(values);
    this.storage.set('lsUserName', values.username);
    this.storage.set('lsEmail', values.email);
    this.storage.set('lsPassword', values.password);
    this.storage.set('lsMobileNo', values.mobileNo);
    this.storage.set('lsRelative', values.relative);
    this.storage.set('lsMemberCategory', values.memberCategory);
    this.storage.set('lsCategory', values.category);
    this.storage.set('lsChapter', values.chapter);
    
    let data: any;
    const url = this.config.domainURL + 'api/signup';
 

    const loading = await this.loadingCtrl.create({
      message: 'Creating New User...',
    });
    data = this.http.post(url,values);
    loading.present().then(() => {
      data.subscribe(result => {
        

        console.log(result);
        console.log("status = " + result.status);
        console.log("User ID = " + result.data.user_id);

        if(result.status = "1"){
          console.log(result);
          console.log(result.data.user_id);
          this.storage.set('lsUserID', result.data.user_id);
          
          
          if(result.message == "Mobile number already exist"){
            this.presentToast(result.message);
          }else{
            this.presentAlertMultipleButtons();
          }

        }else{
            this.presentToast(result.message);
        }

        // console.log(result);
        // console.log(result.data.user_id);

        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });

    this.validations_form.reset();

    // this.router.navigateByUrl('/home');


  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertCtrl.create({
      header: '5AM Fitness Club Welcomes You',
      subHeader: 'Stay Fit Stay Strong',
      message: `
        <ul>
          <li>* Data should be entry between 4 AM to 7 AM</li>
        </ul>
      `,
      // buttons: ['OK']
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigateByUrl('/tabs');
            // console.log('Confirm Okay');
          }
        }
      ]

    });

    await alert.present();
  }


  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      showCloseButton : true,
    });
    toast.present();
  }

  async  getChapter() {
    let data: any;
    const url = this.config.domainURL + 'api/listofchapter';
    data = this.http.get(url);
    data.subscribe(result => {
      this.chapterJson = result.data;
      console.log(result.data);
    }, error => {
      console.log(error);
    });


  }

  relativeOnChange($event) {
    // alert("ask");
     let rel =  $event.target.value;
     if (rel==""){
      this.isHideMember = false;
     }else{
    this.isHideMember = true;
     }
  }

  openPage(page: any) {
    this.navCtrl.navigateForward(page);
  }



}
