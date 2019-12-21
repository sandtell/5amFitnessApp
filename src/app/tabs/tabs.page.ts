import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
            private storage: Storage,
            private router: Router,
            ) {
    // alert('tabs');

    // this.storage.get('lsUserName').then((val) => {
    //   if (val != null) {
    //     // this.router.navigateByUrl('/home');
    //     this.router.navigateByUrl('tabs');
    //   } else {
    //     // this.router.navigateByUrl('/register');
    //     this.router.navigateByUrl('/register');
    //   }
    //   console.log(val);
    // });

  }

}
