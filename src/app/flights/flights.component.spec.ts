import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as moment from 'moment';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlightItem } from '../shared/models/flight-item';
import { FlightPart } from '../shared/models/flight-part';
import { FlightsComponent } from './flights.component';
import { FlightsService } from './flights.service';
import { FlightsFilter } from './models/flights-filter';
import { FlightsSort } from './models/fligts-sort.constant';

describe('FlightsComponent', () => {
    let fixture: ComponentFixture<FlightsComponent>;
    let component: FlightsComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                BrowserAnimationsModule
            ],
            declarations: [
                FlightsComponent
            ],
            providers: [
                FlightsService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FlightsComponent);
        component = fixture.componentInstance;
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it(`should init initial data`, () => {
        expect(component.displayedColumns).toBeTruthy();
        expect(component.dataSource).toBeTruthy();
        expect(component.filter).toBeTruthy();
    });

    it(`should reload data on filter`, () => {
        const filter = new FlightsFilter();
        filter.connectionsCount = 1;

        component.onFilter(filter);

        expect(component.dataSource.data.length).toBeGreaterThan(0);
    });

    it(`should set sort filter on sort`, () => {
        fixture.detectChanges();
        component.sort.sort({ id: FlightsSort.Length, start: 'desc', disableClear: true });

        expect(component.filter.sortBy).toEqual(FlightsSort.Length);
        expect(component.filter.sortDesc).toBeTrue();
    });

    it(`should return tooltip title`, () => {
        const flightItem = new FlightItem(
            new FlightPart('test', moment().hours(0)),
            new FlightPart('test2', moment().hours(5)),
            100
        );

        const tooltip = component.getTooltipTitle(flightItem);

        expect(tooltip).toEqual('Price: 100$. Length: 5 h, 0 min');
    });

    it('should render component', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement;

        const title = compiled.query(By.css('.mat-card-title')).nativeElement.textContent.trim();

        expect(title).toEqual('Flights Timetable');

        const table = compiled.query(By.css('.mat-table')).nativeElement;

        expect(table).toBeTruthy();
    });
});
