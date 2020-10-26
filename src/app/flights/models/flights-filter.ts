export class FlightsFilter {
    originCountry?: string;
    destinationCountry?: string;
    fromDate?: moment.Moment;
    toDate?: moment.Moment;
    connectionsCount: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortDesc: boolean;
}
