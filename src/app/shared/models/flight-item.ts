import * as moment from 'moment';
import { FlightPart } from './flight-part';

export class FlightItem {
    constructor(
        public origin: FlightPart,
        public destination: FlightPart,
        public price: number
    ) {}

    get flightLength(): moment.Duration {
        return moment.duration(this.destination.date.diff(this.origin.date));
    }
}
