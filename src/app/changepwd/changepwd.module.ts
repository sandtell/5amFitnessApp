import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangepwdPageRoutingModule } from './changepwd-routing.module';
import { ChangepwdPage } from './changepwd.page';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    IonicModule,
    ChangepwdPageRoutingModule
  ],
  declarations: [ChangepwdPage]
})
export class ChangepwdPageModule {}
