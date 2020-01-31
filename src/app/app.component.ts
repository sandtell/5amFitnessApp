import { Component } from '@angular/core';
import { Platform, AlertController, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from './services/authentication.service';
import { ConfigService } from './services/config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    public alertCtrl: AlertController,
    private network: Network,
    private toastCtrl: ToastController,
    private authenticationService: AuthenticationService,
    private navController: NavController,
    private config: ConfigService,
    public http: HttpClient,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // alert('component');
      this.statusBar.backgroundColorByHexString("#f04141");

      this.authenticationService.authState.subscribe(state => {
        console.log(state);
        // alert(state);
        if (state) {
          this.navController.navigateRoot(['tabs']);
        } else {
          this.navController.navigateRoot(['register']);
        }
      });

      this.platform.backButton.subscribeWithPriority(0, () => {        
          this.exitFunction('Are you sure you want to Exit App ?');
      });

      // watch network for a disconnection
      this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected ☹️');
        this.presentToast('Internet not available  ☹️');
        this.exitFunction('Exit and try again');
      });

      // watch network for a connection
      this.network.onConnect().subscribe(() => {
        this.presentToast('Network connected! ☺️ ');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            this.presentToast('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
    });
  }

  async exitFunction(msg: string) {
    const alert = await this.alertCtrl.create({
      header: msg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Okay',
          handler: () => {
            navigator['app'].exitApp();
            // console.log('Confirm Okay');
          }
        }
      ]

    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      showCloseButton : true,
    });
    toast.present();
  }

  // async getMaintainence() {
  //   let data: any;
  //   const url = this.config.domainURL + 'api/maintenance';
  //   data = this.http.get(url);
  //   data.subscribe(result => {
  //     console.log(result);
  //     if (result.status === "1") {
  //       this.presentToast(result.message);
  //     }
  //     else if (result.status === "0") {
  //       // alert("else");
  //       this.presentToast(result.message);
  //     }
  //   }, error => {
  //     console.log(error);
  //   });
  // }

}
