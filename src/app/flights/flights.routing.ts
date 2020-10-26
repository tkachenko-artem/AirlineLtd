import { RouterModule, Routes } from '@angular/router';
import { FlightsComponent } from './flights.component';

const flightsRoutes: Routes = [
    {
        path: '',
        component: FlightsComponent
    }
];

export const FlightsRouting = RouterModule.forChild(flightsRoutes);