import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsBackupComponent } from './settings-backup.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

describe('SettingsBackupComponent', () => {
  let component: SettingsBackupComponent;
  let fixture: ComponentFixture<SettingsBackupComponent>;

  beforeEach(async () => {
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({ travels: { names: [] } }),
      getActiveTravelName: jest.fn().mockReturnValue(''),
    };
    await TestBed.configureTestingModule({
      imports: [SettingsBackupComponent],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
