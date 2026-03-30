import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsGraphComponent } from './settings-graph.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsGraphComponent', () => {
  let component: SettingsGraphComponent;
  let fixture: ComponentFixture<SettingsGraphComponent>;

  beforeEach(async () => {
    const localStorageServiceMock = {
      getSettings: jest.fn().mockReturnValue({ graph: { types: {} } }),
      saveSettings: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsGraphComponent, NoopAnimationsModule],
      providers: [
        { provide: LocalstorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
