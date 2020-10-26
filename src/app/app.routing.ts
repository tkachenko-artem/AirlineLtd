import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RedirectDefaultPageGuard } from './core/redirect-default-page.guard';

const appRoutes: Routes = [
    {
        path: 'flights',
        loadChildren: () => import('./flights/flights.module').then(m => m.FlightsModule),
    },

    {
        path: '',
        pathMatch: 'full',
        component: AppComponent,
        canActivate: [RedirectDefaultPageGuard]
    }
];

export const AppRouting = RouterModule.forRoot(appRoutes);
