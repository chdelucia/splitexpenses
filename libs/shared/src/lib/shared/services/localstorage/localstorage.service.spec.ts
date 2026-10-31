import { TestBed } from '@angular/core/testing';

import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create new travel data under its own storage key without overwriting Expenses', () => {
    const defaultData = service.getItem('Expenses');
    expect(defaultData).toBeTruthy();

    service.addNewTravel('Viaje A');

    const travelData = service.getItem('Viaje A');
    expect(travelData).toBeTruthy();
    expect(service.getActiveTravelName()).toBe('Viaje A');

    // Default Expenses should still exist in localstorage
    const defaultDataAfter = service.getItem('Expenses');
    expect(defaultDataAfter).toBeTruthy();
  });

  it('should change active travel and load corresponding data', () => {
    service.addNewTravel('Viaje 1');
    service.addNewTravel('Viaje 2');

    service.changeTravel('Viaje 1');
    expect(service.getActiveTravelName()).toBe('Viaje 1');
    expect(service.getData().name).toBe('Viaje 1');

    service.changeTravel('Viaje 2');
    expect(service.getActiveTravelName()).toBe('Viaje 2');
    expect(service.getData().name).toBe('Viaje 2');
  });
});
