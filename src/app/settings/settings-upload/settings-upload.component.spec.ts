import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsUploadComponent } from './settings-upload.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsUploadComponent', () => {
  let component: SettingsUploadComponent;
  let fixture: ComponentFixture<SettingsUploadComponent>;

  beforeEach(async () => {
    const localStorageServiceMock = {
      getSettings: jest.fn().mockReturnValue({}),
      getActiveTravelName: jest.fn().mockReturnValue('test'),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsUploadComponent, NoopAnimationsModule],
      providers: [
        { provide: LocalstorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
