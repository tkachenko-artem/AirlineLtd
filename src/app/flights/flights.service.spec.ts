import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { Countries } from '../shared/data-store';
import { FlightsService } from './flights.service';
import { FlightsFilter } from './models/flights-filter';
import { FlightsSort } from './models/fligts-sort.constant';

describe('FlightsService', () => {
    let service: FlightsService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [FlightsService] });
        service = TestBed.inject(FlightsService);
    });

    it('should return origin countries', done => {
        service.getOriginCountriesList()
            .subscribe(result => {
                expectAny(result);
                expect(result).toContain(Countries.Australia);
                expect(result).not.toContain(Countries.USA);

                done();
            });
    });

    it('should return destination countries', done => {
        service.getDestinationCountriesList()
            .subscribe(result => {
                expectAny(result);
                expect(result).toContain(Countries.USA);
                expect(result).not.toContain(Countries.Australia);

                done();
            });
    });

    it('should return connection counts', done => {
        service.getConnectionsCountsList()
            .subscribe(result => {
                expectAny(result);
                expect(result).toContain(1);
                expect(result).not.toContain(6);

                done();
            });
    });

    it('should return default flights', done => {
        const defaultFilters = new FlightsFilter();
        defaultFilters.connectionsCount = 0;
        defaultFilters.minPrice = 1;
        defaultFilters.maxPrice = 1000;

        service.getFlights(defaultFilters)
            .subscribe(result => {
                expectAny(result);

                const withMultipleConnections = result.filter(r => r.items.length > 1);

                expect(withMultipleConnections.length).toEqual(0);

                const withCorrectPrice = result.filter(r =>
                    r.totalPrice >= defaultFilters.minPrice && r.totalPrice <= defaultFilters.maxPrice);
                expect(withCorrectPrice.length).toEqual(result.length);

                done();
            });
    });

    it('should return composed flight with 2 connections', done => {
        const filters = new FlightsFilter();
        filters.connectionsCount = 2;
        filters.originCountry = Countries.Ukraine;
        filters.destinationCountry = Countries.USA;

        service.getFlights(filters)
            .subscribe(result => {
                expect(result.length).toEqual(1);

                const flight = result[0];

                expect(flight.items.length).toEqual(3);
                expect(flight.firstOrigin.country).toEqual(filters.originCountry);
                expect(flight.lastDestination.country).toEqual(filters.destinationCountry);

                done();
            });
    });

    it('should return filtered by country flights', done => {
        const filters = new FlightsFilter();
        filters.originCountry = Countries.Ukraine;
        filters.destinationCountry = Countries.Turkey;

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                const validItems = result.filter(r => r.firstOrigin.country === filters.originCountry
                    && r.lastDestination.country === filters.destinationCountry);

                expect(validItems.length).toEqual(result.length);

                done();
            });
    });

    it('should return filtered by dates flights', done => {
        const filters = new FlightsFilter();
        filters.fromDate = moment().hours(0);
        filters.toDate = moment().hours(5);

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                const validItems = result.filter(r => filters.fromDate.isSameOrBefore(r.firstOrigin.date)
                    && filters.toDate.isSameOrAfter(r.lastDestination.date));

                expect(validItems.length).toEqual(result.length);

                done();
            });
    });

    it('should return filtered by price flights', done => {
        const filters = new FlightsFilter();
        filters.minPrice = 100;
        filters.maxPrice = 250;

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                const validItems = result.filter(r => filters.minPrice <= r.totalPrice
                    && r.totalPrice <= filters.maxPrice);

                expect(validItems.length).toEqual(result.length);

                done();
            });
    });

    it('should return filtered by all filters flights', done => {
        const filters = new FlightsFilter();
        filters.minPrice = 100;
        filters.maxPrice = 250;
        filters.connectionsCount = 0;
        filters.destinationCountry = Countries.Turkey;
        filters.originCountry = Countries.Ukraine;
        filters.fromDate = moment().hours(0);
        filters.toDate = moment().hours(4);

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                expect(result.length).toEqual(1);

                done();
            });
    });

    it('should return sorted by price ASC', done => {
        const filters = new FlightsFilter();
        filters.sortBy = FlightsSort.Price;
        filters.sortDesc = false;

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                const firstFlightsPrice = result[0].totalPrice;
                const lastFlightsPrice = result[result.length - 1].totalPrice;

                expect(firstFlightsPrice).toBeLessThan(lastFlightsPrice);

                done();
            });
    });

    it('should return sorted by price DESC', done => {
        const filters = new FlightsFilter();
        filters.sortBy = FlightsSort.Price;
        filters.sortDesc = true;

        service.getFlights(filters)
            .subscribe(result => {
                expectAny(result);

                const firstFlightsPrice = result[0].totalPrice;
                const lastFlightsPrice = result[result.length - 1].totalPrice;

                expect(firstFlightsPrice).toBeGreaterThan(lastFlightsPrice);

                done();
            });
    });

    function expectAny(values: any[]): void {
        expect(values.length).toBeGreaterThan(0);
    }
});
