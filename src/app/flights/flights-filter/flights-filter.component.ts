import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FlightsFilter } from '../models/flights-filter';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FlightsService } from '../flights.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import * as moment from 'moment';
import { ChangeContext, LabelType, Options, PointerType } from 'ng5-slider';

@Component({
    selector: 'app-flights-filter',
    templateUrl: './flights-filter.component.html',
    styleUrls: ['./flights-filter.component.scss']
})
export class FlightsFilterComponent implements OnInit {
    @Output() filterChanged: EventEmitter<FlightsFilter> = new EventEmitter<FlightsFilter>();

    public readonly DEFAULT_ANY_OPTION = -1;

    public readonly FORM_ORIGIN_COUNTRY = 'originCountry';
    public readonly FORM_DESTINATION_COUNTRY = 'destinationCountry';
    public readonly FORM_FROM_DATE = 'fromDate';
    public readonly FORM_TO_DATE = 'toDate';
    public readonly FORM_CONNECTIONS_COUNT = 'connectionsCount';
    public readonly FORM_MIN_PRICE = 'minPrice';
    public readonly FORM_MAX_PRICE = 'maxPrice';

    public MIN_PRICE = 1;
    public MAX_PRICE = 1000;

    public filtersForm: FormGroup;

    public originCountries: string[] = [];
    public destinationCountries: string[] = [];
    public connectionsCounts: number[] = [];

    public priceOptions: Options = {
        floor: this.MIN_PRICE,
        ceil: this.MAX_PRICE,
        translate: (value: number, label: LabelType): string => {
            switch (label) {
                case LabelType.Low:
                    return '<b>Min price:</b> $' + value;
                case LabelType.High:
                    return '<b>Max price:</b> $' + value;
                default:
                    return '$' + value;
            }
        }
    };

    constructor(
        private fb: FormBuilder,
        private flightsService: FlightsService) {
    }

    get isConnectionsAvailable(): boolean {
        if (!this.filtersForm) {
            return false;
        }

        return this.filtersForm.value[this.FORM_ORIGIN_COUNTRY] !== this.DEFAULT_ANY_OPTION
            && this.filtersForm.value[this.FORM_DESTINATION_COUNTRY] !== this.DEFAULT_ANY_OPTION;
    }

    ngOnInit(): void {
        this.createForm();

        this.initFiltersData();
    }

    clearDate(event: any, formControl: string): void {
        event?.stopPropagation();

        this.filtersForm.controls[formControl].reset();
    }

    onPriceChangeEnd(changeContext: ChangeContext): void {
        if (changeContext.pointerType === PointerType.Min) {
            this.filtersForm.controls[this.FORM_MIN_PRICE].setValue(changeContext.value);
        } else {
            this.filtersForm.controls[this.FORM_MAX_PRICE].setValue(changeContext.highValue);
        }
    }

    private createForm(): void {
        this.filtersForm = this.fb.group({
            [this.FORM_ORIGIN_COUNTRY]: new FormControl(this.DEFAULT_ANY_OPTION),
            [this.FORM_DESTINATION_COUNTRY]: new FormControl(this.DEFAULT_ANY_OPTION),
            [this.FORM_FROM_DATE]: new FormControl(null),
            [this.FORM_TO_DATE]: new FormControl(null),
            [this.FORM_CONNECTIONS_COUNT]: new FormControl(0),
            [this.FORM_MIN_PRICE]: new FormControl(this.MIN_PRICE),
            [this.FORM_MAX_PRICE]: new FormControl(this.MAX_PRICE)
        });

        this.filtersForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe(() => {
                if (!this.isConnectionsAvailable) {
                    this.filtersForm.controls[this.FORM_CONNECTIONS_COUNT].setValue(0, { emitEvent: false });
                }

                this.emitFilterChanged();
            });
    }

    private initFiltersData(): void {
        forkJoin([
            this.flightsService.getOriginCountriesList(),
            this.flightsService.getDestinationCountriesList(),
            this.flightsService.getConnectionsCountsList()
        ])
            .subscribe(([originCountries, destCountries, connectionsCounts]) => {
                this.originCountries = originCountries;
                this.destinationCountries = destCountries;
                this.connectionsCounts = connectionsCounts;

                this.emitFilterChanged();
            });
    }

    private emitFilterChanged(): void {
        const filters = this.filtersForm.getRawValue() as FlightsFilter;
        filters.originCountry = filters.originCountry == this.DEFAULT_ANY_OPTION.toString()
            ? null
            : filters.originCountry;

        filters.destinationCountry = filters.destinationCountry == this.DEFAULT_ANY_OPTION.toString()
            ? null
            : filters.destinationCountry;

        filters.connectionsCount = filters.connectionsCount == this.DEFAULT_ANY_OPTION
            ? null
            : filters.connectionsCount;

        filters.fromDate = this.adjustDateMoment(filters.fromDate);
        filters.toDate = this.adjustDateMoment(filters.toDate);

        this.filterChanged.emit(filters);
    }

    private adjustDateMoment(value: any): moment.Moment {
        return value ? moment(value) : null;
    }
}
