import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils/date.utils';

@Pipe({
    name: 'formatMoment'
})
export class FormatMomentPipe implements PipeTransform {

    transform(date, format): any {
         return DateUtils.formatDuration(date, format);
    }
}
