import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsUploadComponent } from './settings-upload.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

describe('SettingsUploadComponent', () => {
  let component: SettingsUploadComponent;
  let fixture: ComponentFixture<SettingsUploadComponent>;

  beforeEach(async () => {
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({}),
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsUploadComponent],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
