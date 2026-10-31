import { NavbarComponent } from './navbar.component';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

describe('NavbarComponent sin tesbed', () => {
  let component: NavbarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    });

    component = TestBed.createComponent(NavbarComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
