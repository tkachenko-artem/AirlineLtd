import { FlightItem } from './flight-item';
import { FlightPart } from './flight-part';

export class Flight {
    items: FlightItem[] = [];

    constructor(items: FlightItem[]) {
        this.items = items;
    }

    get totalPrice(): number {
        return this.items.map(i => i.price).reduce((sum, curr) => sum + curr);
    }

    get totalLength(): moment.Duration {
        return this.items.map(i => i.flightLength).reduce((sum, curr) => sum.add(curr));
    }

    get firstOrigin(): FlightPart {
        return this.items[0].origin;
    }

    get lastDestination(): FlightPart {
        return this.items[this.items.length - 1].destination;
    }

    addFlight(item: FlightItem): void {
        this.items.push(item);
    }
}
