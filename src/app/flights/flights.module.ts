import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlightsService } from './flights.service';
import { FlightsComponent } from './flights.component';
import { FlightsRouting } from './flights.routing';
import { FlightsFilterComponent } from './flights-filter/flights-filter.component';

@NgModule({
    imports: [
        SharedModule,
        FlightsRouting
    ],
    providers: [
        FlightsService
    ],
    declarations: [
        FlightsComponent,
        FlightsFilterComponent
    ]
})
export class FlightsModule { }