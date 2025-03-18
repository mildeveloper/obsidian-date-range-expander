# Date Range Expander

A plugin for Obsidian that allows you to quickly insert a range of dates into your notes. Perfect for planning, journaling, or creating date-based content.

## Features

- Insert a sequence of dates using either an end date or duration
- Format dates according to your preferences
- Create wiki-linked dates automatically
- Optional callout formatting for date ranges
- Flexible file creation options for wiki-linked dates

## How to Use

1. Open the command palette (Ctrl/Cmd + P)
2. Search for "Date Range Expander"
3. Enter your date range details in the modal:
   - Start date (format: YYYYMMDD)
   - Choose either:
     - End date (format: YYYYMMDD), or
     - Duration (1-100 Days/Weeks/Months)
   - Toggle whether to wrap dates in a callout

The plugin will then insert your date range using your configured format settings.

## Settings

### Date Formatting

- **Output date format**: Format for the inserted dates
  - Default: YYYY.MM.DD
  - Example: 2024.03.15

- **Friendly date format**: Format for displaying dates in a more readable way in certains locations like the callout and alert boxes.
  - Default: DDD D MMM YYYY
  - Supports: D, DD, DDD, DDDD, M, MM, MMM, MMMM, Y, YY, YYY, YYYY
  - Example: Fri 15 Mar 2024

- **Date separator**: Character(s) used to separate dates in the sequence
  - Default: ", "
  - Example: 2024.03.15, 2024.03.16, 2024.03.17

### Wiki Links

- **Create wiki links**: Toggle whether dates should be inserted as wiki links
  - When enabled: [[2024.03.15]]
  - When disabled: 2024.03.15

### File Creation Options

When wiki links are enabled, you can choose how to handle non-existent date files:

- **Do not create**: Only create the wiki links, don't create actual files
- **Create in same folder**: Automatically create date files in the same folder as the current note
- **Create in custom folder**: Create date files in a specified folder
  - If selected, you can set a custom folder path (e.g., "Daily Notes")

## Modal Options

### Start Date
- Enter the beginning date in YYYYMMDD format
- Example: 20240315 for March 15, 2024

### Range Type
Choose between two ways to specify your date range:

1. **End Date**
   - Enter the final date in YYYYMMDD format
   - The plugin will create a sequence from start to end date (inclusive of both dates)

2. **Duration**
   - Specify a number (1-100)
   - Choose the unit: Days, Weeks, or Months
   - The plugin will create a sequence starting from the start date for the specified duration

### Callout Option
- Toggle "Add to callout" to wrap your date sequence in a collapsible callout
- Useful for organizing long date sequences

## Examples

1. Simple date range:
```
2024.03.15, 2024.03.16, 2024.03.17
```

2. Wiki-linked dates:
```
[[2024.03.15]], [[2024.03.16]], [[2024.03.17]]
```

3. Dates in a callout:
```
> [!SUMMARY]- Date range: Fri 15 Mar 2024 to Sun 17 Mar 2024
> [[2024.03.15]], [[2024.03.16]], [[2024.03.17]] 
```

## Say Thanks 🙏

If you find this plugin helpful, then maybe... toss a coin to your ~~witcher~~ developer:

[![Ko-Fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/mildeveloper)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/mildeveloper)

Your support helps maintain and improve the plugin! 😊
