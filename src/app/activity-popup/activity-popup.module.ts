import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPopupPageRoutingModule } from './activity-popup-routing.module';

import { ActivityPopupPage } from './activity-popup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityPopupPageRoutingModule
  ],
  declarations: [ActivityPopupPage]
})
export class ActivityPopupPageModule {}
