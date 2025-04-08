import { App, Modal, Setting } from 'obsidian';
import { DateInputModalResponse } from './types';
import { DateUtils } from './dateUtils';

export class DateInputModal extends Modal {
    private startDateValue: string = '';
    private endDateValue: string = '';
    private durationValue: string = '';
    private durationTypeValue: 'Days' | 'Weeks' | 'Months' = 'Days';
    private useCalloutValue: boolean = true;
    private rangeTypeValue: 'EndDate' | 'Duration' = 'EndDate';

    private onSubmit: (dateRangeValues: DateInputModalResponse) => void;
    private submitButton: HTMLButtonElement | null = null;
    private endDateInput: HTMLInputElement;
    private durationInput: HTMLInputElement;
    private durationTypeSelect: HTMLSelectElement;
    private dateUtils: DateUtils;
    private keyboardListener: (event: KeyboardEvent) => void;

    constructor(app: App, onSubmit: (dateRangeValues: DateInputModalResponse) => void) {
        super(app);
        this.onSubmit = onSubmit;
        this.dateUtils = new DateUtils();
        this.setTitle('Enter date range');
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        this.setupKeyboardListener();
        this.createStartDateInput();
        this.createRangeOptions();
        this.createCalloutToggle();
        this.createSubmitButton();
    }

    onClose() {
        const { contentEl } = this;
        // Clean up the keyboard event listener
        if (this.keyboardListener) {
            contentEl.removeEventListener('keydown', this.keyboardListener);
        }
        // Clear the content
        contentEl.empty();
    }

    private validateInput(): boolean {
        const startDateObj = this.dateUtils.parseDateFromString(this.startDateValue);

        if (!startDateObj){
            return false;
        }

        if (this.rangeTypeValue === 'EndDate') {
            const endDateObj = this.dateUtils.parseDateFromString(this.endDateValue);
            return !!endDateObj &&
                this.dateUtils.isValidNumericDate(this.endDateValue) &&
                endDateObj >= startDateObj;
        } else {
            return this.durationValue !== '' &&
                parseInt(this.durationValue) > 0 &&
                ['Days', 'Weeks', 'Months'].includes(this.durationTypeValue);
        }
    }

    private calculateDateCount(): number {
        const startDate = this.dateUtils.parseDateFromString(this.startDateValue);
        if (!startDate) {
            return 0;
        }

        let endDate: Date;

        if (this.rangeTypeValue === 'EndDate') {
            endDate = this.dateUtils.parseDateFromString(this.endDateValue) || startDate;
        } else {
            endDate = new Date(startDate);
            const duration = parseInt(this.durationValue) || 0;

            if (this.durationTypeValue === 'Days') {
                endDate.setDate(endDate.getDate() + duration - 1); // -1 because we include the start date
            } else if (this.durationTypeValue === 'Weeks') {
                endDate.setDate(endDate.getDate() + (duration * 7) - 1);
            } else if (this.durationTypeValue === 'Months') {
                endDate = this.dateUtils.addMonthsToDate(startDate, duration);
            }
        }

        const dateCount = this.dateUtils.calculateDaysInRange(startDate, endDate);
        return dateCount;
    }

    private setupKeyboardListener() {
        this.keyboardListener = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && this.validateInput()) {
                this.submit();
            }
        };
        this.contentEl.addEventListener('keydown', this.keyboardListener);
    }

    private createStartDateInput() {
        new Setting(this.contentEl)
            .setName('Start date')
            .addText(text => {
                text.setPlaceholder('YYYYMMDD')
                    .setValue(this.startDateValue);
                
                text.inputEl.setAttribute('pattern', '[0-9]*');
                text.inputEl.setAttribute('maxlength', '8');
                text.inputEl.addEventListener('input', (e: InputEvent) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/\D/g, '').slice(0, 8);
                    this.startDateValue = input.value;
                    this.updateSubmitButton();
                });
            });
    }

    private createRangeOptions() {
        const optionContainer = this.contentEl.createEl('div', { cls: 'date-option-container' });
        this.createEndDateOption(optionContainer);
        this.createDurationOption(optionContainer);
        this.updateInputStates();
    }

    private createEndDateOption(container: HTMLElement) {
        const endDateRow = container.createEl('div', { cls: 'date-input-row' });
        const endDateLabel = endDateRow.createEl('label');
        endDateLabel.appendText('End date');

        const endDateRadio = endDateLabel.createEl('input', {
            type: 'radio',
            attr: { name: 'dateOption' }
        });
        endDateRadio.checked = this.rangeTypeValue === 'EndDate';

        this.endDateInput = endDateRow.createEl('input', {
            type: 'text',
            placeholder: 'YYYYMMDD',
            value: this.endDateValue,
            attr: {
                pattern: '[0-9]*',
                maxlength: '8'
            }
        });

        this.endDateInput.addEventListener('input', (e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/\D/g, '').slice(0, 8);
            this.endDateValue = input.value;
            this.updateSubmitButton();
        });

        endDateRadio.addEventListener('change', () => {
            this.rangeTypeValue = 'EndDate';
            this.updateInputStates();
            this.updateSubmitButton();
        });
    }

    private createDurationOption(container: HTMLElement) {
        const durationRow = container.createEl('div', { cls: 'date-input-row' });
        const durationLabel = durationRow.createEl('label');
        durationLabel.appendText('Duration');

        const durationRadio = durationLabel.createEl('input', {
            type: 'radio',
            attr: { name: 'dateOption' }
        });
        durationRadio.checked = this.rangeTypeValue === 'Duration';

        this.durationInput = durationRow.createEl('input', {
            type: 'number',
            attr: { 
                min: '1',
                max: '100'
            },
            placeholder: '1-100',
            value: this.durationValue
        });

        this.durationTypeSelect = durationRow.createEl('select');
        this.populateDurationTypes();

        durationRadio.addEventListener('change', () => {
            this.rangeTypeValue = 'Duration';
            this.updateInputStates();
            this.updateSubmitButton();
        });

        this.durationInput.addEventListener('input', (e) => {
            const input = e.target as HTMLInputElement;
            let value = parseInt(input.value);
            if (value > 100) {
                value = 100;
                input.value = '100';
            }
            this.durationValue = value.toString();
            this.updateSubmitButton();
        });

        this.durationTypeSelect.addEventListener('change', (e) => {
            this.durationTypeValue = (e.target as HTMLSelectElement).value as 'Days' | 'Weeks' | 'Months';
            this.updateSubmitButton();
        });
    }

    private populateDurationTypes() {
        ['Days', 'Weeks', 'Months'].forEach(type => {
            const option = this.durationTypeSelect.createEl('option', {
                value: type,
                text: type
            });
            option.selected = type === this.durationTypeValue;
        });
    }

    private updateInputStates() {
        const isEndDateMode = this.rangeTypeValue === 'EndDate';
        this.endDateInput.disabled = !isEndDateMode;
        this.durationInput.disabled = isEndDateMode;
        this.durationTypeSelect.disabled = isEndDateMode;
    }

    private createCalloutToggle() {
        new Setting(this.contentEl)
            .setName('Add to callout')
            .setDesc('Insert dates inside a collapsed callout')
            .addToggle(toggle => toggle
                .setValue(this.useCalloutValue)
                .onChange(value => {
                    this.useCalloutValue = value;
                })
            );
    }

    private createSubmitButton() {
        this.submitButton = new Setting(this.contentEl)
            .addButton(btn => btn
                .setButtonText('Insert')
                .setCta()
                .onClick(() => this.submit())
            ).settingEl.querySelector('button');

        if (this.submitButton) {
            this.submitButton.disabled = true;
        }
    }

    private updateSubmitButton() {
        if (this.submitButton) {
            const validInput = this.validateInput();
            this.submitButton.disabled = !validInput;

            if (validInput) {
                const dateCount = this.calculateDateCount();
                this.submitButton.textContent = `Insert ${dateCount} date${dateCount !== 1 ? 's' : ''}`;
            } else {
                this.submitButton.textContent = 'Insert';
            }
        }
    }

    private submit() {
        if (!this.validateInput()) {
            return;
        }

        const startDateObj = this.dateUtils.parseDateFromString(this.startDateValue);
        if (!startDateObj) {
            return;
        }

        const dateRangeValues: DateInputModalResponse = {
            startDate: startDateObj,
            rangeType: this.rangeTypeValue,
            useCallout: this.useCalloutValue
        };

        if (this.rangeTypeValue === 'EndDate') {
            const endDateObj = this.dateUtils.parseDateFromString(this.endDateValue);
            if (endDateObj)
                dateRangeValues.endDate = endDateObj;
        } else {
            dateRangeValues.duration = parseInt(this.durationValue);
            dateRangeValues.durationUnit = this.durationTypeValue;
        }

        this.close();

        if (this.onSubmit) {
            this.onSubmit(dateRangeValues);
        }
    }
}