import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // public domainURL: string = "https://synergy.sandtell.com/";
  public domainURL: string = "https://synergy.brilienzacademy.in/";
  constructor(
    public http: HttpClient,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private router: Router,
    private iab: InAppBrowser
  ) {
    this.getMaintainence();
    this.checkAppUpdate();
   }

  async getMaintainence() {
    let data: any;
    const url = this.domainURL + 'api/setting';    
    data = this.http.get(url);
      data.subscribe(result => {
        console.log(result);
        if(result.status === "4") {
          // this.router.navigateByUrl('maintenance');
          // console.log(result.data.message);
          this.router.navigateByUrl(`/maintenance/${result.data.message}`);
          this.presentToast(result.message);
        }
    }, error => {
      console.log(error);
    });
  }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  async checkAppUpdate() {
    // alert('if');
    let data: any;
    const url = this.domainURL + 'api/version_available';
    data = this.http.get(url);
      data.subscribe(result => {
        console.log(result);
        // alert(result.url);
        if(result.status === "1") {          
          this.alertFunc(result.message, result.data.url);
        }
    }, error => {
      console.log(error);
    });
  }

  async alertFunc(msg: string,url:string) {
    const alert = await this.alertCtrl.create({
      header: msg,
      buttons: [
        //   {
        //   text: 'Cancel',
        //   role: 'cancel',
        //   handler: () => {

        //   }
        // },
        {
          text: 'Okay',
          handler: () => {
            // 
            this.iab.create(url,'_system');
            // console.log('Confirm Okay');
          }
        }
      ]

    });

    await alert.present();
  }


}
