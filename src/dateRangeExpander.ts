import { App, Notice, TFolder } from 'obsidian';
import { PluginSettings, DateRange, DEFAULT_SETTINGS } from './types';
import { DateUtils } from './dateUtils';

export class DateRangeExpander {
    app: App;
    settings: PluginSettings;
    dateUtils: DateUtils;

    constructor(app: App, settings: PluginSettings, dateUtils: DateUtils) {
        this.app = app;
        this.settings = settings;
        this.dateUtils = dateUtils;
    }

    wrapInCallout(dateStartAndEnd: DateRange, insertedDateRange: string): string {
        const [startDateFormat, endDateFormat] = this.getFormatedStartAndEndDates(dateStartAndEnd);
        return `\n> [!SUMMARY]- Date range: ${startDateFormat} to ${endDateFormat}\n> ${insertedDateRange}\n`;
    }

    expandDateRange(dateStartAndEnd: DateRange): string | null{
        let totalDates = 0;
        let createdFiles = 0;
        let existingFiles = 0;
        let customFolderExists = true;

        let dates = [];
        let current = new Date(dateStartAndEnd.startDate);

        const customFolder = this.app.vault.getAbstractFileByPath(this.settings.customFolderPath);
        
        if (this.settings.createNonExistentFiles === 'custom-folder' && !(customFolder instanceof TFolder)) {
            customFolderExists = false;
        }

        while (current <= dateStartAndEnd.endDate) {
            let formattedDate = this.dateUtils.formatDateToString(current, this.settings.outputDateFormat, DEFAULT_SETTINGS.outputDateFormat);

            if (this.settings.createWikiLinks) {
                dates.push(`[[${formattedDate}]]`);

                const fileCreationResult = this.createFileIfNeeded(formattedDate, customFolderExists);
                if (fileCreationResult === 'created')
                    createdFiles++;
                else if (fileCreationResult === 'exists')
                    existingFiles++;
            } else {
                dates.push(formattedDate);
            }
            totalDates++;

            current.setDate(current.getDate() + 1);
        }

        if (createdFiles > 0 && !customFolderExists) {
            new Notice(`Folder "${this.settings.customFolderPath}" does not exist. Using parent folder to current note instead.`);
        }

        const [startDateFormat, endDateFormat] = this.getFormatedStartAndEndDates(dateStartAndEnd);

        const commonNoticeText = `Inserted ${totalDates} dates from ${startDateFormat} to ${endDateFormat}`;
        if (this.settings.createNonExistentFiles !== 'do-not-create') {
            new Notice(`${commonNoticeText}\n\n• Files created: ${createdFiles}\n• Files skipped: ${existingFiles}`, 8000);
        } else {
            new Notice(commonNoticeText, 8000);
        }

        return dates.join(this.settings.dateSeparator);
    }

    createFileIfNeeded(formattedDate: string, customFolderExists: boolean): 'created' | 'exists' | 'failed' {
        const currentFile = this.app.workspace.getActiveFile();
        if (!currentFile || !currentFile.parent) {
            return 'failed';
        }

        const fileName = `${formattedDate}.md`;
        const fileExists = this.fileExistsInVault(formattedDate);

        if (!fileExists) {
            let filePath = '';

            switch (this.settings.createNonExistentFiles) {
                case 'same-folder':
                    const currentDir = currentFile.parent.path;
                    filePath = currentDir ? `${currentDir}/${fileName}` : fileName;
                    break;
                case 'custom-folder':
                    if (customFolderExists) {
                        filePath = `${this.settings.customFolderPath}/${fileName}`;
                    } else {
                        // Fallback to same folder if custom path is empty or not found
                        const currentDir = currentFile.parent.path;
                        filePath = currentDir ? `${currentDir}/${fileName}` : fileName;
                    }
                    break;
                case 'do-not-create':
                    return 'failed';
                default:
                    return 'failed';
            }

            if (filePath) {
                this.app.vault.create(filePath, "");
                return 'created';
            }
            return 'failed';
        } else {
            return 'exists';
        }
    }

    fileExistsInVault(formattedDate: string): boolean {
        return this.app.metadataCache.getFirstLinkpathDest(formattedDate, '') !== null;
    }

    private getFormatedStartAndEndDates(dateStartAndEnd: DateRange): [string, string] {
        const startDateFormat = this.dateUtils.formatDateToString(dateStartAndEnd.startDate, this.settings.friendlyDateFormat, DEFAULT_SETTINGS.friendlyDateFormat);
        const endDateFormat = this.dateUtils.formatDateToString(dateStartAndEnd.endDate, this.settings.friendlyDateFormat, DEFAULT_SETTINGS.friendlyDateFormat);

        return [startDateFormat, endDateFormat];
    }
}