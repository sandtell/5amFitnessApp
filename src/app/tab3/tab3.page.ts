import { Component, OnInit , ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab3Page {

  public jsonItems: any =[];
  public noRecord:boolean = false;
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private config: ConfigService,
    private router: Router,
  ) { 

  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.getData('walking');
  }

  onTabChanged($event) {
    console.log($event.index);

    let index = $event.index;

    if(index == 0){
      this.getData('walking');
    }else if (index == 1 ){
      this.getData('swimming');
    }else if (index == 2 ){
      this.getData('jogging');
    }else if (index == 3 ){
      this.getData('Running');
    }else if (index == 4 ){
      this.getData('Yoga');
    }else if (index == 5 ){
      this.getData('Cycling');
    }


  }

  async getData(mode) {

    let tempArr = {
      fitnessMode: mode,
      sortby: "today",
    };

    let data: Observable<any>;
    let url = this.config.domainURL + 'api/leadershipboard';
    const loading = await this.loadingCtrl.create({
      message: 'Please Wait...',
    });

    data = this.http.post(url,tempArr);
    loading.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.jsonItems = result.data;

        if(result.status == "2"){
          this.noRecord = true;
        }else if (result.status == "4") {
          this.router.navigateByUrl('maintenance');
        }else{
          this.noRecord = false;
        }

        loading.dismiss();
      });
      return loading.present();
    }, error => {
      console.log(error);
      loading.dismiss();
    });
  }


}
