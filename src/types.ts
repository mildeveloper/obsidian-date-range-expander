export interface PluginSettings {
    outputDateFormat: string;
    friendlyDateFormat: string;
    dateSeparator: string;
    createWikiLinks: boolean;
    createNonExistentFiles: 'do-not-create' | 'same-folder' | 'custom-folder';
    customFolderPath: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    outputDateFormat: 'YYYY.MM.DD',
    friendlyDateFormat: 'DDD D MMM YYYY',
    dateSeparator: ', ',
    createWikiLinks: true,
    createNonExistentFiles: 'same-folder',
    customFolderPath: ''
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface DateInputModalResponse {
    startDate: Date;
    rangeType: 'EndDate' | 'Duration';
    endDate?: Date;
    duration?: number;
    durationUnit?: 'Days' | 'Weeks' | 'Months';
    useCallout: boolean;
}