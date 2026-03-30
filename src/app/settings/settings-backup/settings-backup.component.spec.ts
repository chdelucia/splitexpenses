import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsBackupComponent } from './settings-backup.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsBackupComponent', () => {
  let component: SettingsBackupComponent;
  let fixture: ComponentFixture<SettingsBackupComponent>;

  beforeEach(async () => {
    const localStorageServiceMock = {
      getSettings: jest.fn().mockReturnValue({ travels: { names: [] } }),
      getActiveTravelName: jest.fn().mockReturnValue('test'),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsBackupComponent, NoopAnimationsModule],
      providers: [
        { provide: LocalstorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
