import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SettingsUploadComponent } from './settings-upload.component';

describe('SettingsUploadComponent', () => {
  let component: SettingsUploadComponent;
  let fixture: ComponentFixture<SettingsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [SettingsUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
