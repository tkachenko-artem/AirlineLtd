import * as moment from 'moment';

export class FlightPart {
    constructor(
        public country: string,
        public date: moment.Moment
    ) {}
}
