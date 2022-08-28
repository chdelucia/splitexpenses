import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsGraphComponent } from './settings-graph.component';

describe('SettingsGraphComponent', () => {
  let component: SettingsGraphComponent;
  let fixture: ComponentFixture<SettingsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
