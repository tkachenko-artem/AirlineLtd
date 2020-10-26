import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { DummyFlights } from '../shared/data-store';
import { Flight } from '../shared/models/flight';
import { FlightsFilter } from './models/flights-filter';
import { FlightsSort } from './models/fligts-sort.constant';
import * as _ from 'underscore';

@Injectable()
export class FlightsService {
    getFlights(filters: FlightsFilter): Observable<Flight[]> {
        // in real world it will be request to API and all filtering there
        return of(this.getFilteredFlights(filters));
    }

    getOriginCountriesList(): Observable<string[]> {
        const countries = this.getDistinctValues(
            DummyFlights.map(f => {
                return f.firstOrigin.country;
            }));

        return of(countries);
    }

    getDestinationCountriesList(): Observable<string[]> {
        const countries = this.getDistinctValues(
            DummyFlights.map(f => {
                return f.lastDestination.country;
            }));

        return of(countries);
    }

    getConnectionsCountsList(): Observable<number[]> {
        return of([0, 1, 2]);
    }

    private getFilteredFlights(filters: FlightsFilter): Flight[] {
        const allFlights = DummyFlights;
        let filteredFlights = [...allFlights];

        if (filters.connectionsCount > 0 && filters.originCountry && filters.destinationCountry) {
            filteredFlights = this.composeFlights(filters);

            filteredFlights = filteredFlights.filter(f => f.items.length <= filters.connectionsCount + 1);
        }

        filteredFlights = this.filterByCountry(filteredFlights, filters);

        filteredFlights = this.filterByDates(filteredFlights, filters);
        filteredFlights = this.filterByPrice(filteredFlights, filters);

        if (filters.sortBy) {
            filteredFlights = this.sortFlights(filteredFlights, filters.sortBy, filters.sortDesc);
        }

        return filteredFlights;
    }

    private composeFlights(filters: FlightsFilter): Flight[] {
        const allFlights = [...DummyFlights];

        const flights: Flight[] = [];

        const originFlights = allFlights.filter(f => f.firstOrigin.country === filters.originCountry);
        const destinationFlights = allFlights.filter(f => f.lastDestination.country === filters.destinationCountry);

        if (!originFlights.length || !destinationFlights.length) {
            return allFlights;
        }

        originFlights.forEach(origin => {
            const flight = new Flight([origin.items[0]]);

            for (let i = 0; i < filters.connectionsCount; i++) {
                const connection = i + 1 < filters.connectionsCount
                    ? allFlights.find(f => f.firstOrigin.country === flight.lastDestination.country
                        && f.firstOrigin.date.isSame(flight.lastDestination.date, 'day'))
                    : allFlights.find(f => f.firstOrigin.country === flight.lastDestination.country
                        && f.firstOrigin.date.isSame(flight.lastDestination.date, 'day')
                        && f.lastDestination.country === filters.destinationCountry);

                if (connection) {
                    flight.addFlight(connection.items[0]);
                } else {
                    continue;
                }
            }

            flights.push(flight);
        });

        return flights;
    }

    private filterByCountry(filteredFlights: Flight[], filters: FlightsFilter): Flight[] {
        if (filters.originCountry) {
            filteredFlights = filteredFlights.filter(f => f.firstOrigin.country === filters.originCountry);
        }

        if (filters.destinationCountry) {
            filteredFlights = filteredFlights.filter(f => f.lastDestination.country === filters.destinationCountry);
        }

        return filteredFlights;
    }

    private filterByDates(filteredFlights: Flight[], filters: FlightsFilter): Flight[] {
        if (filters.fromDate) {
            filteredFlights = filteredFlights.filter(f => filters.fromDate.isSameOrBefore(f.firstOrigin.date));
        }

        if (filters.toDate) {
            filteredFlights = filteredFlights.filter(f => filters.toDate.isSameOrAfter(f.lastDestination.date));
        }

        return filteredFlights;
    }

    private filterByPrice(filteredFlights: Flight[], filters: FlightsFilter): Flight[] {
        if (filters.minPrice) {
            filteredFlights = filteredFlights.filter(f => f.totalPrice >= filters.minPrice);
        }

        if (filters.maxPrice) {
            filteredFlights = filteredFlights.filter(f => f.totalPrice <= filters.maxPrice);
        }

        return filteredFlights;
    }

    private sortFlights(filteredFlights: Flight[], sortBy: string, sortDesc: boolean): Flight[] {
        switch (sortBy) {
            case FlightsSort.Connections: {
                const sorted = _.sortBy(filteredFlights, (flight: Flight) => {
                    return flight.items.length;
                });

                filteredFlights = sortDesc
                    ? sorted.reverse()
                    : sorted;

                break;
            }

            case FlightsSort.Length:
            case FlightsSort.Price: {
                const sortField = sortBy === FlightsSort.Length
                    ? 'totalLength'
                    : 'totalPrice';

                const sorted = _.sortBy(filteredFlights, sortField);

                filteredFlights = sortDesc
                    ? sorted.reverse()
                    : sorted;

                break;
            }

            case FlightsSort.From: {
                const sorted = _.sortBy(filteredFlights, (flight: Flight) => {
                    return flight.firstOrigin.date;
                });

                filteredFlights = sortDesc
                    ? sorted.reverse()
                    : sorted;

                break;
            }

            case FlightsSort.To: {
                const sorted = _.sortBy(filteredFlights, (flight: Flight) => {
                    return flight.lastDestination.date;
                });

                filteredFlights = sortDesc
                    ? sorted.reverse()
                    : sorted;

                break;
            }
        }

        return filteredFlights;
    }

    private getDistinctValues(values: any[]): any[] {
        return values.filter((value, i, arr) => arr.findIndex(t => t === value) === i);
    }
}
