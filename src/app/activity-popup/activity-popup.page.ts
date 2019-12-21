import { Component, OnInit } from '@angular/core';
import { NavParams , Platform, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-activity-popup',
  templateUrl: './activity-popup.page.html',
  styleUrls: ['./activity-popup.page.scss'],
})
export class ActivityPopupPage implements OnInit {
  passedId = null;
  icon = null;
  fitnessMode = null;
  fitnessType:string;
  getTodaysDate = null;
  public userName: string = null;
  public stepCount: number = null;

  public walkingHours: string;
  public placeOfWalking: string;
  public isBtnEnable: boolean = true;
  public isChkTime:boolean = false;
  constructor(
    private navParams: NavParams,
    private platform: Platform,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    private config: ConfigService,
    public http: HttpClient,
    private modalCtrl: ModalController,
  ) {
    this.platform.backButton.subscribe(() => {
      this.modalCtrl.dismiss();
    });
   }

   ngOnInit() { 

    this.getTimeLimit();
     

    this.storage.get('lsUserName').then((val) => {
      if (val != null) {
        this.userName = val;
      }
    });

    this.storage.get('lsUserID').then((val) => {
      console.log("User ID = " + val);
    });

    this.passedId = this.navParams.get('custom_id');
    this.icon = this.navParams.get('icon');
    this.fitnessMode = this.navParams.get('fitnessMode');
    this.getTodaysDate = new Date();

    if(this.fitnessMode == "Swimming" || this.fitnessMode == "Yoga" || this.fitnessMode == "Cycling"){
      this.fitnessType = "Calories Burn";
    }else {
      this.fitnessType = "Step Count";
    }

    console.log(this.getTodaysDate);
    // console.log(this.fitnessMode);


  }

  async saveData() {

    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });



    this.storage.get('lsUserID').then((userID) => {

      let tempArr = {
        user_id: userID,
        minutes: this.walkingHours,
        fitnessMode: this.fitnessMode,
        stepCount: this.stepCount,
        placeOfWalking: this.placeOfWalking
      };

      console.log("User ID = " + userID);

      let data: any;
      const url = this.config.domainURL + 'api/addactivity';
      data = this.http.post(url, tempArr);
      loading.present().then(() => {
        data.subscribe(result => {
          console.log(result);
          this.presentToast(result.message);
          loading.dismiss();
          if (result.status = "1") {
            this.closeModal();
            // this.router.navigateByUrl('/home');
          }

        });
        return loading.present();
      }, error => {
        console.log(error);
        loading.dismiss();
      });

      // this.router.navigateByUrl('/home');

    });

    // console.log(tempArr);

    // console.log(this.walkingHours)
    // console.log(this.fitnessMode);
    // console.log(this.stepCount);
    // console.log(this.placeOfWalking);
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  onChange($event) {
    // alert("ask");
    // console.log($event.target.value);
    let hours = $event.target.value;

    if (hours == 30) {
      this.stepCount = 3000;
    } else if (hours == 60) {
      this.stepCount = 6000;
    } else if (hours == 90) {
      this.stepCount = 9000;
    } else if (hours == 120) {
      this.stepCount = 12000;
    } else if (hours == 150) {
      this.stepCount = 15000;
    } else if (hours == 180) {
      this.stepCount = 18000;
    }

    // console.log(this.stepCount);


  }


  ontextBoxChange($event) {
    let place = $event.target.value;

    if(this.isChkTime){
      if (place != '' && this.stepCount != 0) {
        this.isBtnEnable = false;
      } else {
        this.isBtnEnable = true;
      }
    }

    
    // console.log($event.target.value);
  }

  getTimeLimit() {
    let data: any;
    const url = this.config.domainURL + 'api/setting';
    data = this.http.get(url);
    data.subscribe(result => {
      console.log(result);

      let  d = new Date();
      let currentTime = d.getTime();

      // this.startTime = result.data[0].value;
      // this.endTime = result.data[1].value;

      let startTimeFromDB = result.data[0].value * 1000;
      let endTimeFromDB = result.data[1].value * 1000;



      // console.log(this.currentTime);

      if((startTimeFromDB <= currentTime) && (endTimeFromDB >= currentTime)){
        // alert("yes");
        this.isChkTime = true;
      }
      else{
        this.isChkTime = false;
        this.presentToast('Data should be entry between 4 AM to 7 AM ');
        //alert("No");
      }


      // console.log(result.data[0].value);
      // console.log(result.data[1].value);

      // let d = new Date();
      // let n = d.getTime();
  
      // console.log(d);
      // console.log(n);

    }, error => {
      console.log(error);
    });

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
