import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public jsonItems: any = [];
  public isHideShow: boolean = false;
  // fitnessType:string;
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private config: ConfigService,
    private storage: Storage,
    public toastController: ToastController,
    private router: Router,
  ) {

  }

  doRefresh(event) {    
    this.getActivityData();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  ngOnInit() {
    this.getActivityData();
  }

  ionViewDidEnter() {
    this.getActivityData();
  }

  fitnessMode(mode){
    
    if(mode == "Swimming" || mode == "Yoga" || mode == "Cycling"){
      return "CALORIES BURN";
    }else {
      return "STEP COUNT";
    }
  }
  // onChange($event) {
  //   let fitnessMode = $event.target.value;
  //   console.log(fitnessMode);
  //   this.getData(fitnessMode);
  // }

  // async getData(mode) {
  async getActivityData() {
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });
    this.storage.get('lsUserID').then((userID) => {
      // let tempArr = {
      //   user_id: userID,
      //   fitnessMode: mode
      // };
      let tempArr = {
        user_id: userID,
      };
      console.log("User ID = " + userID);
      let data: any;
      const url = this.config.domainURL + 'api/myactivity';
      data = this.http.post(url, tempArr);
      loading.present().then(() => {
        data.subscribe(result => {
          this.jsonItems = result.data;
          console.log(result);

          if (result.status == "2") {
            this.isHideShow = false;
            this.presentToast(result.message);
          } else if (result.status == "1") {
            this.isHideShow = true;
          } else if (result.status == "4") {
            this.router.navigateByUrl('maintenance');
          }

          loading.dismiss();
        });
        return loading.present();
      }, error => {
        console.log(error);
        loading.dismiss();
      });
    });
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
