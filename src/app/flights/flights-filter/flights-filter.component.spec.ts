import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { ChangeContext, PointerType } from 'ng5-slider';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlightsService } from '../flights.service';
import { FlightsFilterComponent } from './flights-filter.component';

describe('FlightsFilterComponent', () => {
    let fixture: ComponentFixture<FlightsFilterComponent>;
    let component: FlightsFilterComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                BrowserAnimationsModule
            ],
            declarations: [
                FlightsFilterComponent
            ],
            providers: [
                FlightsService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FlightsFilterComponent);
        component = fixture.componentInstance;
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it(`should create filters form`, () => {
        component.ngOnInit();

        const filtersForm = component.filtersForm;

        expect(filtersForm).toBeTruthy();

        expect(filtersForm.controls[component.FORM_ORIGIN_COUNTRY].value).toEqual(component.DEFAULT_ANY_OPTION);
        expect(filtersForm.controls[component.FORM_DESTINATION_COUNTRY].value).toEqual(component.DEFAULT_ANY_OPTION);
        expect(filtersForm.controls[component.FORM_CONNECTIONS_COUNT].value).toEqual(0);
        expect(filtersForm.controls[component.FORM_MIN_PRICE].value).toEqual(component.MIN_PRICE);
        expect(filtersForm.controls[component.FORM_MAX_PRICE].value).toEqual(component.MAX_PRICE);
    });

    it(`should init filters data`, () => {
        component.ngOnInit();

        expectAny(component.originCountries);
        expectAny(component.destinationCountries);
        expectAny(component.connectionsCounts);
    });

    it(`should clear form fromDate value`, () => {
        component.ngOnInit();

        const controlName = component.FORM_FROM_DATE;
        component.filtersForm.controls[controlName].setValue(moment());

        component.clearDate(null, controlName);

        expect(component.filtersForm.controls[controlName].value).toBeNull();
    });

    it(`should change min price`, () => {
        component.ngOnInit();

        const controlName = component.FORM_MIN_PRICE;

        const changeContext = new ChangeContext();
        changeContext.value = 50;
        changeContext.pointerType = PointerType.Min;

        component.onPriceChangeEnd(changeContext);

        expect(component.filtersForm.controls[controlName].value).toEqual(50);
    });

    it(`should change max price`, () => {
        component.ngOnInit();

        const controlName = component.FORM_MAX_PRICE;

        const changeContext = new ChangeContext();
        changeContext.highValue = 350;
        changeContext.pointerType = PointerType.Max;

        component.onPriceChangeEnd(changeContext);

        expect(component.filtersForm.controls[controlName].value).toEqual(350);
    });

    it('should render form', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement;

        const rows = compiled.queryAllNodes(By.css('.flex-row'));

        expect(rows.length).toEqual(2);

        const matFormFields = compiled.queryAllNodes(By.css('.mat-form-field'));

        expect(matFormFields.length).toEqual(5);
    });

    function expectAny(values: any[]): void {
        expect(values.length).toBeGreaterThan(0);
    }
});
