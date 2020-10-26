import * as moment from 'moment';
import { Flight } from './models/flight';
import { FlightItem } from './models/flight-item';
import { FlightPart } from './models/flight-part';

export const Countries = {
    Ukraine: 'Ukraine',
    Turkey: 'Turkey',
    India: 'India',
    Australia: 'Australia',
    USA: 'USA'
};

export const DummyFlights = [
    new Flight([
        new FlightItem(
            new FlightPart(Countries.Ukraine, moment().hours(1)),
            new FlightPart(Countries.Turkey, moment().hours(3)),
            100
        )
    ]),
    new Flight([
        new FlightItem(
            new FlightPart(Countries.Turkey, moment().hours(4)),
            new FlightPart(Countries.India, moment().hours(7)),
            120
        )
    ]),
    new Flight([
        new FlightItem(
            new FlightPart(Countries.India, moment().hours(8)),
            new FlightPart(Countries.Ukraine, moment().hours(12)),
            250
        )
    ]),
    new Flight([
        new FlightItem(
            new FlightPart(Countries.Australia, moment().hours(2)),
            new FlightPart(Countries.Ukraine, moment().hours(27)),
            950
        )
    ]),
    new Flight([
        new FlightItem(
            new FlightPart(Countries.India, moment().hours(8)),
            new FlightPart(Countries.USA, moment().hours(18)),
            300
        )
    ])
];
