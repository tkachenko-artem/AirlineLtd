import { NgModule } from '@angular/core';
import { FormatMomentPipe } from './format-moment.pipe';

@NgModule({
    declarations: [
        FormatMomentPipe
    ],
    exports: [
        FormatMomentPipe
    ]
})
export class PipesModule { }
