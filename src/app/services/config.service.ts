import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // public domainURL: string = "https://synergy.sandtell.com/";
  public domainURL: string = "https://synergy.brilienzacademy.in/";
  constructor(
    public http: HttpClient,
    public toastController: ToastController,
    private router: Router,
  ) {
    this.getMaintainence();
   }

  async getMaintainence() {
    let data: any;
    const url = this.domainURL + 'api/setting';    
    data = this.http.get(url);
      data.subscribe(result => {
        console.log(result);
        if(result.status === "4") {
          this.router.navigateByUrl('maintenance');
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

}
