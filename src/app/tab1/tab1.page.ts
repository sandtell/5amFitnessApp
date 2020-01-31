import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivityPopupPage } from '../activity-popup/activity-popup.page';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  value = 0;
  public userName:string = "";
  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private router: Router
  ) {


    // console.log(this.constructor.name);
    this.userName = localStorage.getItem('localUserName');

    this.storage.get('lsUserName').then((val) => {
      if (val != null) {
        this.userName = val;
      }
    });
   }

   ngOnInit() { 
    this.storage.get('lsUserName').then((val) => {
      if (val != null) {
        this.userName = val;
      }
    });
   }

  async openModal(icon, fitnessMode) {
    const modal = await this.modalCtrl.create({
      component: ActivityPopupPage,
      componentProps: {
        custom_id: this.value,
        icon: icon,
        fitnessMode: fitnessMode
      }
    });
    modal.present();
  }

  logOutFn(){
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.router.navigateByUrl('/register');
  }
}
