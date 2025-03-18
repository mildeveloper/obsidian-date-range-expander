import { DateUtils } from '../src/dateUtils';
import { DateInputModalResponse } from '../src/types';

describe('DateUtils', () => {
    let dateUtils: DateUtils;

    beforeEach(() => {
        dateUtils = new DateUtils();
    });

    describe('getStartAndEndDates', () => {
        describe('EndDate range type', () => {
            test('should return correct date range when end date is after start date', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    rangeType: 'EndDate',
                    endDate: new Date(Date.UTC(2023, 0, 5)), // Jan 5, 2023
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 5)));
            });

            test('should return null when end date is before start date', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 5)), // Jan 5, 2023
                    rangeType: 'EndDate',
                    endDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    useCallout: false
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).toBeNull();
            });

            test('should return correct date range when start and end dates are the same', () => {
                const sameDate = new Date(Date.UTC(2023, 0, 1)); // Jan 1, 2023
                const modalResponse: DateInputModalResponse = {
                    startDate: sameDate,
                    rangeType: 'EndDate',
                    endDate: new Date(Date.UTC(2023, 0, 1)), // Create a new Date object with the same values
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(sameDate);
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
            });
        });

        describe('Duration range type with Days unit', () => {
            test('should calculate correct end date for 1 day duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    rangeType: 'Duration',
                    duration: 1,
                    durationUnit: 'Days',
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 1))); // Same day (1 day duration - 1)
            });

            test('should calculate correct end date for 7 days duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    rangeType: 'Duration',
                    duration: 7,
                    durationUnit: 'Days',
                    useCallout: false
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 7))); // Jan 7, 2023 (7 days duration - 1)
            });

            test('should handle month boundary correctly with days duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 30)), // Jan 30, 2023
                    rangeType: 'Duration',
                    duration: 5,
                    durationUnit: 'Days',
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 30)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 1, 3))); // Feb 3, 2023 (5 days duration - 1)
            });
        });

        describe('Duration range type with Weeks unit', () => {
            test('should calculate correct end date for 1 week duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    rangeType: 'Duration',
                    duration: 1,
                    durationUnit: 'Weeks',
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 7))); // Jan 7, 2023 (7 days)
            });

            test('should calculate correct end date for 2 weeks duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 1)), // Jan 1, 2023
                    rangeType: 'Duration',
                    duration: 2,
                    durationUnit: 'Weeks',
                    useCallout: false
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 1)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2023, 0, 14))); // Jan 14, 2023 (14 days)
            });

            test('should handle month and year boundaries with weeks duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 11, 26)), // Dec 26, 2023
                    rangeType: 'Duration',
                    duration: 2,
                    durationUnit: 'Weeks',
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 11, 26)));
                expect(result?.endDate).toEqual(new Date(Date.UTC(2024, 0, 8))); // Jan 8, 2024 (14 days later - 1)
            });
        });

        describe('Duration range type with Months unit', () => {
            test('should calculate correct end date for 1 month duration', () => {
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 15)), // Jan 15, 2023
                    rangeType: 'Duration',
                    duration: 1,
                    durationUnit: 'Months',
                    useCallout: true
                };

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 15)));
                expect(result?.endDate.getFullYear()).toBe(2023);
                expect(result?.endDate.getMonth()).toBe(1); // February (0-indexed)
                expect(result?.endDate.getDate()).toBe(14);
            });

            test('should handle month with different days correctly', () => {
                // Testing with Jan 31 + 1 month should result in Feb 28 (in 2023, non-leap year)
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2023, 0, 31)), // Jan 31, 2023
                    rangeType: 'Duration',
                    duration: 1,
                    durationUnit: 'Months',
                    useCallout: false
                };

                const expectedResult = new Date(2023, 1, 28); // Feb 28, 2023
                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2023, 0, 31)));
                expect(result?.endDate).toEqual(expectedResult);
            });

            test('should handle leap year edge case correctly', () => {
                // Testing Feb 29, 2024 (leap year) + 1 month
                const modalResponse: DateInputModalResponse = {
                    startDate: new Date(Date.UTC(2024, 1, 29)), // Feb 29, 2024
                    rangeType: 'Duration',
                    duration: 1,
                    durationUnit: 'Months',
                    useCallout: true
                };

                // Assuming addMonthsToDate handles this correctly
                const expectedResult = new Date(2024, 2, 28); // Mar 28, 2024

                const result = dateUtils.getStartAndEndDates(modalResponse);

                expect(result).not.toBeNull();
                expect(result?.startDate).toEqual(new Date(Date.UTC(2024, 1, 29)));
                expect(result?.endDate).toEqual(expectedResult);
            });
        });
    });

    describe('parseDateFromString', () => {
        test.each([
            // [description, input, expected]
            ['parses a standard date', '20240101', new Date(Date.UTC(2024, 0, 1))],
            ['parses a date with single-digit month and day', '20240501', new Date(Date.UTC(2024, 4, 1))],
            ['parses a date at month boundary', '20241231', new Date(Date.UTC(2024, 11, 31))],
            ['parses a leap year date', '20240229', new Date(Date.UTC(2024, 1, 29))],
        ])('%s', (_, input, expected) => {
            const result = dateUtils.parseDateFromString(input);
            expect(result).toEqual(expected);
        });

        test.each([
            // Edge cases where isValidNumericDate would return true but we want to test parsing logic
            ['handles January correctly (month 1 → index 0)', '20240101', 0],
            ['handles December correctly (month 12 → index 11)', '20241201', 11],
        ])('%s', (_, input, expectedMonth) => {
            const result = dateUtils.parseDateFromString(input);
            expect(result?.getMonth()).toBe(expectedMonth);
        });

        // Test that years, months, and days are parsed correctly
        test('parses the date components correctly', () => {
            const result = dateUtils.parseDateFromString('20241015');

            expect(result?.getFullYear()).toBe(2024);
            expect(result?.getMonth()).toBe(9); // October is month 9 in JS
            expect(result?.getDate()).toBe(15);
        });
    });

    describe('isValidNumericDate', () => {
        // Valid dates tests
        test.each([
            ['20240307', 'Current date'],
            ['19991231', 'Last day of 1999'],
            ['20000101', 'First day of 2000'],
            ['20240229', 'Leap year day in 2024'],
            ['19000101', 'Year 1900'],
            ['49991231', 'Far future date']
        ])('should return true for valid date %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(true);
        });

        // Invalid format tests
        test.each([
            ['', 'Empty string'],
            ['2024-03-07', 'ISO format with hyphens'],
            ['03/07/2024', 'MM/DD/YYYY format'],
            ['202403', 'Too few digits'],
            ['202403071', 'Too many digits'],
            ['2024030', 'Incomplete date'],
            ['YYYYMMDD', 'Non-numeric characters'],
            ['2024/03/07', 'With slashes'],
            ['20240a07', 'With letter'],
            [' 20240307', 'With leading space'],
            ['20240307 ', 'With trailing space']
        ])('should return false for invalid format %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(false);
        });

        // Invalid year tests
        test.each([
            ['18991231', 'Year < 1900'],
        ])('should return false for invalid year in %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(false);
        });

        // Invalid month tests
        test.each([
            ['20240001', 'Month = 00'],
            ['20241301', 'Month = 13'],
            ['20249901', 'Month = 99']
        ])('should return false for invalid month in %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(false);
        });

        // Invalid day tests
        test.each([
            ['20240100', 'Day = 00'],
            ['20240132', 'Day = 32'],
            ['20240199', 'Day = 99'],
            ['20240230', 'February 30 in leap year'],
            ['20230229', 'February 29 in non-leap year'],
            ['20240431', 'Day 31 in 30-day month (April)'],
            ['20240631', 'Day 31 in 30-day month (June)'],
            ['20240931', 'Day 31 in 30-day month (September)'],
            ['20241131', 'Day 31 in 30-day month (November)'],
            ['21000229', 'February 29 in centuary leap year but not quad-centuary (2100'],
            ['22000229', 'February 29 in centuary leap year but not quad-centuary (2200'],
            ['23000229', 'February 29 in centuary leap year but not quad-centuary (2300']
        ])('should return false for invalid day in %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(false);
        });

        // Edge cases
        test.each([
            ['19000101', 'Minimum valid year'],
            ['50001231', 'Maximum valid year'],
            ['20240101', 'First day of month'],
            ['20240131', 'Last day of 31-day month'],
            ['20240229', 'Last day of February in leap year 2024'],
            ['20250228', 'Last day of February in non-leap year 2025'],
            ['20000229', 'Last day of February in century leap year 2000']
        ])('should properly validate edge case %s (%s)', (input, _description) => {
            expect(dateUtils.isValidNumericDate(input)).toBe(true);
        });

        // Specific edge case for year 1900 (not a leap year despite being divisible by 4)
        test('should correctly handle century year 1900 (not a leap year)', () => {
            expect(dateUtils.isValidNumericDate('19000229')).toBe(false);
        });
    });

    describe('formatDateToString', () => {
        // Standard use cases
        describe('standard formats', () => {
            test('should format date using YYYY-MM-DD pattern', () => {
                const date = new Date(Date.UTC(2023, 0, 15)); // January 15, 2023
                const result = dateUtils.formatDateToString(date, 'YYYY-MM-DD', 'M/D/YYYY');
                expect(result).toBe('2023-01-15');
            });

            test('should format date using MMM D, YYYY pattern', () => {
                const date = new Date(Date.UTC(2023, 2, 10)); // March 10, 2023
                const result = dateUtils.formatDateToString(date, 'MMM D, YYYY', 'M/D/YYYY');
                expect(result).toBe('Mar 10, 2023');
            });

            test('should format date with full month and day names', () => {
                const date = new Date(Date.UTC(2023, 6, 4)); // July 4, 2023
                const result = dateUtils.formatDateToString(date, 'DDDD, MMMM D, YYYY', 'M/D/YYYY');
                expect(result).toBe('Tuesday, July 4, 2023');
            });
        });

        // Testing individual format tokens
        describe('format tokens', () => {
            const testDate = new Date(Date.UTC(2023, 11, 5)); // December 5, 2023 (Tuesday)

            test.each([
                ['YYYY', '2023'],
                ['YYY', '023'],
                ['YY', '23'],
                ['Y', '3'],
                ['MMMM', 'December'],
                ['MMM', 'Dec'],
                ['MM', '12'],
                ['M', '12'],
                ['DDDD', 'Tuesday'],
                ['DDD', 'Tue'],
                ['DD', '05'],
                ['D', '5']
            ])('should correctly format %s token', (format, expected) => {
                const result = dateUtils.formatDateToString(testDate, format, 'M/D/YYYY');
                expect(result).toBe(expected);
            });
        });

        // Edge cases
        describe('edge cases', () => {
            test('should handle single-digit day and month', () => {
                const date = new Date(Date.UTC(2023, 0, 1)); // January 1, 2023
                const result = dateUtils.formatDateToString(date, 'M/D/YYYY', 'MM/DD/YYYY');
                expect(result).toBe('1/1/2023');
            });

            test('should handle last day of the year', () => {
                const date = new Date(Date.UTC(2023, 11, 31)); // December 31, 2023
                const result = dateUtils.formatDateToString(date, 'YYYY-MM-DD', 'M/D/YYYY');
                expect(result).toBe('2023-12-31');
            });

            test('should handle February 29 on leap year', () => {
                const date = new Date(Date.UTC(2024, 1, 29)); // February 29, 2024 (leap year)
                const result = dateUtils.formatDateToString(date, 'MMMM D, YYYY', 'M/D/YYYY');
                expect(result).toBe('February 29, 2024');
            });

            test('should handle pattern with repeated tokens', () => {
                const date = new Date(Date.UTC(2023, 4, 15)); // May 15, 2023
                const result = dateUtils.formatDateToString(date, 'YYYY-MM-DD (DDDD)', 'M/D/YYYY');
                expect(result).toBe('2023-05-15 (Monday)');
            });
        });

        // Date boundary tests
        describe('date boundaries', () => {
            test('should handle dates at year boundaries', () => {
                // New Year's Eve
                let date = new Date(Date.UTC(2023, 11, 31, 23, 59, 59));
                let result = dateUtils.formatDateToString(date, 'YYYY-MM-DD', 'M/D/YYYY');
                expect(result).toBe('2023-12-31');

                // New Year's Day
                date = new Date(Date.UTC(2024, 0, 1, 0, 0, 1));
                result = dateUtils.formatDateToString(date, 'YYYY-MM-DD', 'M/D/YYYY');
                expect(result).toBe('2024-01-01');
            });

            test('should handle historical dates', () => {
                const date = new Date(Date.UTC(1900, 0, 1)); // January 1, 1900
                const result = dateUtils.formatDateToString(date, 'MMMM D, YYYY', 'M/D/YYYY');
                expect(result).toBe('January 1, 1900');
            });

            test('should handle future dates', () => {
                const date = new Date(Date.UTC(2123, 5, 15)); // June 15, 2123
                const result = dateUtils.formatDateToString(date, 'MMMM D, YYYY', 'M/D/YYYY');
                expect(result).toBe('June 15, 2123');
            });
        });

        // Patterns with non-token text
        describe('patterns with mixed content', () => {
            test('should preserve non-token text in format', () => {
                const date = new Date(Date.UTC(2023, 6, 4)); // July 4, 2023
                const result = dateUtils.formatDateToString(date, 'Created on MMMM D, YYYY at noon', 'M/D/YYYY');
                expect(result).toBe('Created on July 4, 2023 at noon');
            });

            test('should handle formats with special characters', () => {
                const date = new Date(Date.UTC(2023, 8, 15)); // September 15, 2023
                const result = dateUtils.formatDateToString(date, 'YYYY.MM.DD - (DDD)', 'M/D/YYYY');
                expect(result).toBe('2023.09.15 - (Fri)');
            });
        });

        describe('day of week calculations', () => {
            test('should correctly determine weekday names', () => {
                // Test all days of a week
                const weekdays = [
                    new Date(Date.UTC(2023, 9, 1)), // Sunday, October 1, 2023
                    new Date(Date.UTC(2023, 9, 2)), // Monday, October 2, 2023
                    new Date(Date.UTC(2023, 9, 3)), // Tuesday, October 3, 2023
                    new Date(Date.UTC(2023, 9, 4)), // Wednesday, October 4, 2023
                    new Date(Date.UTC(2023, 9, 5)), // Thursday, October 5, 2023
                    new Date(Date.UTC(2023, 9, 6)), // Friday, October 6, 2023
                    new Date(Date.UTC(2023, 9, 7))  // Saturday, October 7, 2023
                ];

                const expectedNames = [
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
                ];

                weekdays.forEach((date, index) => {
                    const result = dateUtils.formatDateToString(date, 'DDDD', 'M/D/YYYY');
                    expect(result).toBe(expectedNames[index]);
                });
            });
        });
    });

    describe('addMonthsToDate', () => {
        // Format: [startDate, monthsToAdd, expectedDate]
        // Using strings in ISO format: 'YYYY-MM-DD'
        const testCases = [
            // Basic cases
            ['2024-01-15', 1, '2024-02-14'],  // Regular month addition
            ['2024-07-02', 1, '2024-08-01'],  // Regular month addition
            ['2024-04-10', 3, '2024-07-09'],  // Multiple months
            ['2024-03-05', 12, '2025-03-04'], // Year boundary

            // In same month
            ['2024-07-01', 1, '2024-07-31'],  // In same month
            ['2024-06-01', 1, '2024-06-30'],  // In same month
            ['2024-02-01', 1, '2024-02-29'],  // In same month
            ['2025-02-01', 1, '2025-02-28'],  // In same month

            // Month-end cases
            ['2024-01-31', 1, '2024-02-29'],  // To leap day
            ['2024-01-30', 1, '2024-02-29'],  // To leap day
            ['2023-01-31', 1, '2023-02-28'],  // To non-leap Feb
            ['2023-01-30', 1, '2023-02-28'],  // To non-leap Feb
            ['2023-01-29', 1, '2023-02-28'],  // To non-leap Feb
            ['2024-02-29', 1, '2024-03-28'],  // From leap day
            ['2024-01-31', 2, '2024-03-30'],  // 31 month to 31 month
            ['2024-01-31', 3, '2024-04-30'],  // 31 month to 30 month (January to April)
            ['2024-03-31', 1, '2024-04-30'],  // 31 month to 30 month (March to April)

            // Other scenarios
            ['2024-12-15', 1, '2025-01-14'],  // Year crossover
            ['2024-07-04', 24, '2026-07-03'], // Multi-year
            ['2024-08-15', 0, '2024-08-15'],  // Zero months
            ['2024-02-29', 12, '2025-02-28'], // Leap to non-leap year
            ['2023-02-28', 12, '2024-02-27'], // Non-leap to leap year
            ['2020-02-29', 48, '2024-02-28'], // Leap year to leap year
            ['2021-02-28', 48, '2025-02-27'], // Non-leap year to non-leap year
            ['2024-01-30', 1, '2024-02-29']   // Day preservation in leap
        ];

        testCases.forEach(([startStr, months, expectedStr]) => {
            it(`should add ${months} month(s) to ${startStr} and get ${expectedStr}`, () => {
                // Arrange
                const startDate = new Date(startStr);
                const expectedDate = new Date(expectedStr);

                // Act
                const resultDate = dateUtils.addMonthsToDate(startDate, months as number);

                // Assert
                expect(resultDate.getFullYear()).toBe(expectedDate.getFullYear());
                expect(resultDate.getMonth()).toBe(expectedDate.getMonth());
                expect(resultDate.getDate()).toBe(expectedDate.getDate());
            });
        });
    });

    describe('calculateDaysInRange', () => {
        // Normal cases
        test('returns correct number of days for same date', () => {
            const date = new Date('2023-05-15');
            expect(dateUtils.calculateDaysInRange(date, date)).toBe(1);
        });

        test('returns correct number of days for consecutive dates', () => {
            const startDate = new Date('2023-05-15');
            const endDate = new Date('2023-05-16');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(2);
        });

        test('returns correct number of days for a week period', () => {
            const startDate = new Date('2023-05-15');
            const endDate = new Date('2023-05-21');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(7);
        });

        test('returns correct number of days for a month period', () => {
            const startDate = new Date('2023-05-01');
            const endDate = new Date('2023-05-31');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(31);
        });

        test('handles leap year correctly', () => {
            const startDate = new Date('2024-02-28');
            const endDate = new Date('2024-03-01');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(3); // Feb 28, 29, Mar 1
        });

        test('handles month boundaries correctly', () => {
            const startDate = new Date('2023-05-31');
            const endDate = new Date('2023-06-02');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(3);
        });

        test('handles year boundaries correctly', () => {
            const startDate = new Date('2023-12-30');
            const endDate = new Date('2024-01-02');
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(4);
        });

        test('handles dates far apart', () => {
            const startDate = new Date('2000-01-01');
            const endDate = new Date('2023-12-31');
            // 8766 days including both start and end dates
            expect(dateUtils.calculateDaysInRange(startDate, endDate)).toBe(8766);
        });
    });
});