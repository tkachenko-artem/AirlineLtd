import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as menuTitle 'Flights'`, () => {
    expect(component.menuTitle).toEqual('Flights');
  });

  it('should render menuTitle', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#menu .item').textContent).toContain('Flights');
  });

  it(`should have as userName 'Test User'`, () => {
    expect(component.userName).toEqual('Test User');
  });

  it('should render name in header', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement;

    const menuButtonText = compiled.query(By.css('#menu button')).nativeElement.textContent.trim();

    expect(menuButtonText).toEqual('Welcome, Test User');
  });
});
