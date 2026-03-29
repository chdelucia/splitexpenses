import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SettingsGraphComponent } from './settings-graph.component';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

describe('SettingsGraphComponent', () => {
  let component: SettingsGraphComponent;
  let fixture: ComponentFixture<SettingsGraphComponent>;

  beforeEach(async () => {
    const mockLocalStorageService = {
      getSettings: jest.fn().mockReturnValue({ graph: { types: {} } }),
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsGraphComponent],
      providers: [
        { provide: LocalstorageService, useValue: mockLocalStorageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
