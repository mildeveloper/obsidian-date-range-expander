import { Editor, MarkdownView, Plugin } from 'obsidian';
import { DateInputModal } from './dateInputModal';
import { DEFAULT_SETTINGS, PluginSettings } from './types';
import { DateRangeExpanderSettingTab } from './settingsTab';
import { DateUtils } from './dateUtils';
import { DateRangeExpander } from './dateRangeExpander';

export default class DateRangeExpanderPlugin extends Plugin {
	settings: PluginSettings;
	dateRangeExpander: DateRangeExpander;
	dateUtils: DateUtils;

	async onload() {
		await this.loadSettings();
	
		this.dateUtils = new DateUtils();
		this.dateRangeExpander = new DateRangeExpander(this.app, this.settings, this.dateUtils);
	
		this.addSettingTab(new DateRangeExpanderSettingTab(this.app, this));
	
		this.addCommand({
			id: 'insert-expanded-date-range',
			name: 'Insert',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new DateInputModal(this.app, (rangeInput) => {
					const dateStartAndEnd = this.dateUtils.getStartAndEndDates(rangeInput);
	
					if (dateStartAndEnd) {
						const cursor = editor.getCursor();
						let insertedDateRange = this.dateRangeExpander.expandDateRange(dateStartAndEnd) + ' ';
						if (rangeInput.useCallout) {
							insertedDateRange = this.dateRangeExpander.wrapInCallout(dateStartAndEnd, insertedDateRange);
						}
						editor.replaceRange(insertedDateRange, { line: cursor.line, ch: cursor.ch }, cursor);
	
						const endPos = { line: cursor.line, ch: cursor.ch + insertedDateRange.length };
						editor.setCursor(endPos);
					}
				}).open();
			}
		});
	}

	async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()); }

	async saveSettings() { await this.saveData(this.settings); }
}