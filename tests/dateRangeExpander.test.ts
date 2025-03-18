import { App, Notice, TFolder } from 'obsidian';
import { DateRangeExpander } from '../src/dateRangeExpander';
import { DateUtils } from '../src/dateUtils';
import { PluginSettings, DEFAULT_SETTINGS, DateRange } from '../src/types';

// Mock App
const mockApp = {
    vault: {
        getAbstractFileByPath: jest.fn(),
        create: jest.fn()
    },
    metadataCache: {
        getFirstLinkpathDest: jest.fn()
    },
    workspace: {
        getActiveFile: jest.fn()
    }
} as unknown as App;

// Mock settings with default values
const mockSettings: PluginSettings = {
    ...DEFAULT_SETTINGS,
    outputDateFormat: 'YYYY-MM-DD',
    dateSeparator: ', ',
    createWikiLinks: true,
    createNonExistentFiles: 'do-not-create',
    customFolderPath: 'test-folder'
};

describe('DateRangeExpander', () => {
    describe('wrapInCallout', () => {
        let dateRangeExpander: DateRangeExpander;
        let dateUtils: DateUtils;

        beforeEach(() => {
            dateUtils = new DateUtils();
            dateRangeExpander = new DateRangeExpander(mockApp, mockSettings, dateUtils);
        });

        test('should handle single-day date ranges', () => {
            const dateRange: DateRange = {
                startDate: new Date('2024-03-15'),
                endDate: new Date('2024-03-15')
            };
            const insertedDates = '[[2024-03-15]]';

            const result = dateRangeExpander.wrapInCallout(dateRange, insertedDates);
            
            expect(result).toBe(
                '\n> [!SUMMARY]- Date range: Fri 15 Mar 2024 to Fri 15 Mar 2024\n> [[2024-03-15]]\n'
            );
        });

        test('should wrap a simple date range in a callout', () => {
            const dateRange: DateRange = {
                startDate: new Date('2024-03-15'),
                endDate: new Date('2024-03-17')
            };
            const insertedDates = '[[2024-03-15]], [[2024-03-16]], [[2024-03-17]]';

            const result = dateRangeExpander.wrapInCallout(dateRange, insertedDates);
            
            expect(result).toBe(
                '\n> [!SUMMARY]- Date range: Fri 15 Mar 2024 to Sun 17 Mar 2024\n> [[2024-03-15]], [[2024-03-16]], [[2024-03-17]]\n'
            );
        });
    });

    describe('expandDateRange', () => {
        let dateRangeExpander: DateRangeExpander;
        let dateUtils: DateUtils;

        beforeEach(() => {
            dateUtils = new DateUtils();
            dateRangeExpander = new DateRangeExpander(mockApp, mockSettings, dateUtils);
        });

        test('should handle single-day date range', () => {
            const dateRange: DateRange = {
                startDate: new Date('2024-03-15'),
                endDate: new Date('2024-03-15')
            };

            const result = dateRangeExpander.expandDateRange(dateRange);

            expect(result).toBe('[[2024-03-15]]');
        });

        test('should expand a simple date range', () => {
            const dateRange: DateRange = {
                startDate: new Date('2024-03-15'),
                endDate: new Date('2024-03-17')
            };

            const result = dateRangeExpander.expandDateRange(dateRange);

            expect(result).toBe('[[2024-03-15]], [[2024-03-16]], [[2024-03-17]]');
        });

        test('should use custom date separator', () => {
            const settingsWithCustomSeparator: PluginSettings = {
                ...mockSettings,
                dateSeparator: ' | '
            };
            dateRangeExpander = new DateRangeExpander(mockApp, settingsWithCustomSeparator, dateUtils);

            const dateRange: DateRange = {
                startDate: new Date('2024-03-15'),
                endDate: new Date('2024-03-16')
            };

            const result = dateRangeExpander.expandDateRange(dateRange);

            expect(result).toBe('[[2024-03-15]] | [[2024-03-16]]');
        });

        test('should use output date format', () => {
            const settingsWithCustomSeparator: PluginSettings = {
                ...mockSettings,
                outputDateFormat: 'DDDD D MMMM YYYY'
            };
            dateRangeExpander = new DateRangeExpander(mockApp, settingsWithCustomSeparator, dateUtils);

            const dateRange: DateRange = {
                startDate: new Date('2024-03-9'),
                endDate: new Date('2024-03-10')
            };

            const result = dateRangeExpander.expandDateRange(dateRange);

            expect(result).toBe('[[Saturday 9 March 2024]], [[Sunday 10 March 2024]]');
        });
    }); 
});