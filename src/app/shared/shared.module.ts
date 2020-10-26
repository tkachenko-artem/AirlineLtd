import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
} from '@angular-material-components/datetime-picker';
import { Ng5SliderModule } from 'ng5-slider';

export const MatComponents = [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatNativeDateModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatSliderModule
];

@NgModule({
    imports: [
        CommonModule,
        MatComponents,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        Ng5SliderModule
    ],
    declarations: [
        MenuComponent
    ],
    exports: [
        MenuComponent,
        CommonModule,
        MatComponents,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        Ng5SliderModule
    ]
})
export class SharedModule { }