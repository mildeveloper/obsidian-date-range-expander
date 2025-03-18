import { DateInputModalResponse, DateRange } from './types';

export class DateUtils {
    getStartAndEndDates(modalResponse: DateInputModalResponse): DateRange | null {
        let startDate: Date = modalResponse.startDate;
        let endDate: Date;

        if (modalResponse.rangeType === 'EndDate') {
            endDate = modalResponse.endDate!;
        } else {
            endDate = new Date(startDate);
            const duration = modalResponse.duration!;
            const unit = modalResponse.durationUnit!;

            switch (unit) {
                case 'Days':
                    endDate.setDate(startDate.getDate() + duration - 1);
                    break;
                case 'Weeks':
                    endDate.setDate(startDate.getDate() + (duration * 7) - 1);
                    break;
                case 'Months':
                    endDate = this.addMonthsToDate(startDate, duration);
                    break;
            }
        }

        if (startDate > endDate) {
            return null;
        }

        const dateStartAndEnd: DateRange = {
            startDate: startDate,
            endDate: endDate
        };

        return dateStartAndEnd;
    }

    // Assuming string date is in format: YYYYMMDD
    parseDateFromString(dateString: string): Date | null {
        if (!this.isValidNumericDate(dateString)) {
            return null;
        }

        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1;
        const day = parseInt(dateString.substring(6, 8));

        const date = new Date(Date.UTC(year, month, day));
        return date;
    }

    // Returns true if string date is in format: YYYYMMDD
    isValidNumericDate(dateString: string): boolean {
        if (!/^\d{8}$/.test(dateString))
            return false;

        const year = parseInt(dateString.substring(0, 4));
        const month = parseInt(dateString.substring(4, 6)) - 1; // JavaScript months are 0-indexed
        const day = parseInt(dateString.substring(6, 8));

        // Additional validation
        if (year < 1900)
            return false;
        if (month < 0 || month > 11)
            return false;
        if (day < 1 || day > 31)
            return false;

        const dateObj = new Date(year, month, day);

        return dateObj.getFullYear() === year &&
            dateObj.getMonth() === month &&
            dateObj.getDate() === day;
    }

    formatDateToString(date: Date, settingsFormat: string, defaultFormat: string): string {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const weekday = date.getDay();

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dayAbbreviations = dayNames.map(day => day.slice(0, 3));
        const monthAbbreviations = monthNames.map(month => month.slice(0, 3));

        const formatDate = (format: string): string => {
            return format.replace(/YYYY|YYY|YY|Y|MMMM|MMM|MM|M|DDDD|DDD|DD|D/g, (match) => {
                switch (match) {
                    case 'YYYY': return year.toString();
                    case 'YYY': return year.toString().slice(-3);
                    case 'YY': return year.toString().slice(-2);
                    case 'Y': return year.toString().slice(-1);
                    case 'MMMM': return monthNames[month];
                    case 'MMM': return monthAbbreviations[month];
                    case 'MM': return (month + 1).toString().padStart(2, '0');
                    case 'M': return (month + 1).toString();
                    case 'DDDD': return dayNames[weekday];
                    case 'DDD': return dayAbbreviations[weekday];
                    case 'DD': return day.toString().padStart(2, '0');
                    case 'D': return day.toString();
                    default: return match;
                }
            });
        };

        try {
            return formatDate(settingsFormat);
        } catch (error) {
            // Fallback to default format if anything goes wrong
            return formatDate(defaultFormat);
        }
    }

    addMonthsToDate(date: Date, months: number): Date {
        if (months === 0) {
            return date;
        }   

        const newDate = new Date(date);

        const currentDay = date.getDate();

        newDate.setMonth(newDate.getMonth() + months);
        newDate.setDate(newDate.getDate() - 1);

        // Check if the day changed (which means we went into the next month)
        if (newDate.getMonth() !== date.getMonth() && newDate.getDate() !== (currentDay - 1)) {
            // If the day changed, it means we landed on the wrong day
            // Set to the last day of the previous month
            newDate.setDate(0);
        }

        return newDate;
    }

    calculateDaysInRange(startDate: Date, endDate: Date): number {
        const millisecondsInDay = 1000 * 60 * 60 * 24;

        const differenceMilliseconds = endDate.getTime() - startDate.getTime();
        const differenceDays = Math.floor(differenceMilliseconds / millisecondsInDay) + 1; // +1 to include both start and end dates

        return Math.max(0, differenceDays);
    }
}