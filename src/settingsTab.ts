import { App, PluginSettingTab, Setting } from 'obsidian';
import DateRangeExpanderPlugin from './main';
import { DEFAULT_SETTINGS } from './types';

export class DateRangeExpanderSettingTab extends PluginSettingTab {
    plugin: DateRangeExpanderPlugin;

    constructor(app: App, plugin: DateRangeExpanderPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        this.createDateFormatSettings();
        this.createWikiLinkSettings();
    }

    private createDateFormatSettings() {
        new Setting(this.containerEl)
            .setName('Output date format')
            .setDesc(`Format for output dates (e.g., ${DEFAULT_SETTINGS.outputDateFormat})`)
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.outputDateFormat)
                .setValue(this.plugin.settings.outputDateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.outputDateFormat = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(this.containerEl)
            .setName('Friendly date format')
            .setDesc(`Format for friendly date display (e.g., ${DEFAULT_SETTINGS.friendlyDateFormat}). Supports D, DD, DDD, DDDD, M, MM, MMM, MMMM, Y, YY, YYY, YYYYM.`)
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.friendlyDateFormat)
                .setValue(this.plugin.settings.friendlyDateFormat)
                .onChange(async (value) => {
                    this.plugin.settings.friendlyDateFormat = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(this.containerEl)
            .setName('Date separator')
            .setDesc(`Separator between dates (e.g., "${DEFAULT_SETTINGS.dateSeparator}")`)
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.dateSeparator)
                .setValue(this.plugin.settings.dateSeparator)
                .onChange(async (value) => {
                    this.plugin.settings.dateSeparator = value;
                    await this.plugin.saveSettings();
                }));
    }

    private createWikiLinkSettings() {
        new Setting(this.containerEl)
            .setName('Create wiki links')
            .setDesc('Create wiki links for inserted dates')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.createWikiLinks)
                .onChange(async (value) => {
                    this.plugin.settings.createWikiLinks = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.createWikiLinks) {
            this.createNonExistentFilesSettings();
        }
    }

    private createNonExistentFilesSettings() {
        new Setting(this.containerEl)
            .setName('Create non-existent files')
            .setDesc('What to do if a wiki linked file does not exist')
            .addDropdown(dropdown => dropdown
                .addOption('do-not-create', 'Do not create')
                .addOption('same-folder', 'Create in same folder')
                .addOption('custom-folder', 'Create in custom folder')
                .setValue(this.plugin.settings.createNonExistentFiles)
                .onChange(async (value: 'do-not-create' | 'same-folder' | 'custom-folder') => {
                    this.plugin.settings.createNonExistentFiles = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.createNonExistentFiles === 'custom-folder') {
            this.createCustomFolderPathSetting();
        }
    }

    private createCustomFolderPathSetting() {
        new Setting(this.containerEl)
            .setName('Custom folder path')
            .setDesc('Path to the folder where new files should be created (e.g., "Daily Notes/2025")')
            .addText(text => {
                text.setPlaceholder('Enter folder path')
                    .setValue(this.plugin.settings.customFolderPath || '')
                    .onChange(async (value) => {
                        this.plugin.settings.customFolderPath = value;
                        await this.plugin.saveSettings();
                    });
            });
    }
}