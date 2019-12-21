import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivityPopupPage } from './activity-popup.page';

describe('ActivityPopupPage', () => {
  let component: ActivityPopupPage;
  let fixture: ComponentFixture<ActivityPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
