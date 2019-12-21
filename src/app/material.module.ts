import { NgModule } from "@angular/core";
import {   
  MatTabsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
  
} from "@angular/material";
 
@NgModule({
  exports: [
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ]
})
export class MaterialModule {}