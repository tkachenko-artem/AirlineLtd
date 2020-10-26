import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Flight } from '../shared/models/flight';
import { FlightItem } from '../shared/models/flight-item';
import { FlightsService } from './flights.service';
import { FlightsFilter } from './models/flights-filter';
import { DateUtils, FORMAT_TIME_DURATION } from './../shared/utils/date.utils';
import { FlightsSort } from './models/fligts-sort.constant';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-flights',
    templateUrl: './flights.component.html',
    styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;

    FORMAT_TIME_DURATION = FORMAT_TIME_DURATION;
    DEFAULT_SORT_FIELD = FlightsSort.Connections;

    displayedColumns: string[] = ['flight', 'connections', 'from', 'to', 'price', 'length'];
    dataSource = new MatTableDataSource<Flight>();
    filter = new FlightsFilter();

    constructor(
        private flightsService: FlightsService) {
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => {
            this.filter.sortBy = this.sort.active;

            this.filter.sortDesc = this.sort.direction === 'desc';

            this.reloadData();
        });
    }

    onFilter(filter: FlightsFilter): void {
        this.filter = filter;

        this.reloadData();
    }

    getTooltipTitle(item: FlightItem): string {
        const flightLength = DateUtils.formatDuration(item.flightLength, this.FORMAT_TIME_DURATION);

        return `Price: ${item.price}$. Length: ${flightLength}`;
    }

    private reloadData(): void {
        this.filter.sortBy = this.filter.sortBy || this.DEFAULT_SORT_FIELD;

        this.flightsService.getFlights(this.filter)
            .subscribe(flights => {
                this.dataSource = new MatTableDataSource(flights);
            });
    }
}
