import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SettingsTravelComponent } from './settings-travel.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('SettingsTravelComponent', () => {
  let component: SettingsTravelComponent;
  let fixture: ComponentFixture<SettingsTravelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SettingsTravelComponent],
      providers: [
        provideMockStore({
          initialState: {
            expenses: { expenses: {} },
            users: { users: {} },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
