import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsUploadComponent } from './settings-upload.component';

describe('SettingsUploadComponent', () => {
  let component: SettingsUploadComponent;
  let fixture: ComponentFixture<SettingsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
