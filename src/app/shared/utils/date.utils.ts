import * as moment from 'moment';

export const FORMAT_TIME_DURATION = 'H [h], m [min]';

export class DateUtils {
    static formatDuration(time: any, format: string): string {
        if (moment.isDuration(time)) {
            return moment(`${time.hours()}:${time.minutes()}:${time.seconds()}`, 'H:m:s').format(format);
        }

        if (moment.isMoment(time)) {
            return time.format(format);
        }

        return time;
    }
}
