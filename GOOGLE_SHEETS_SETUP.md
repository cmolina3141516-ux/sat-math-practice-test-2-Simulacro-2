# Google Sheets Setup For SAT Math

The app cannot write directly to the spreadsheet edit URL. For browser-based saving, use a Google Apps Script Web App that appends rows into this sheet:

`https://docs.google.com/spreadsheets/d/1YWPa4oyxabUj5qO14baa4QrhgC8GmrP7Sp0uUIeELek/edit?usp=sharing`

## 1. Open Apps Script

1. Open the spreadsheet.
2. Go to `Extensions -> Apps Script`.
3. Replace the default script with the code below.

## 2. Apps Script Code

The ready-to-copy script is also saved in this project at:

`google-apps-script/simulacro2-results.gs`

```javascript
const SPREADSHEET_ID = '1YWPa4oyxabUj5qO14baa4QrhgC8GmrP7Sp0uUIeELek';
const SHEET_NAME = 'Simulacro 2 Math';

const MODULE_1_KEY = {
  1: 'B', 2: 'C', 3: 'B', 4: 'A', 5: 'A', 6: '9', 7: '224',
  8: 'A', 9: 'C', 10: 'B', 11: 'A', 12: 'B', 13: '40', 14: '14',
  15: 'C', 16: 'D', 17: 'B', 18: 'D', 19: 'D', 20: '52', 21: '-3', 22: 'B',
};

const MODULE_2_KEY = {
  1: 'B', 2: 'B', 3: 'D', 4: 'B', 5: 'D', 6: '70', 7: '1',
  8: 'D', 9: 'A', 10: 'D', 11: 'C', 12: 'D', 13: '45', 14: '2;-12',
  15: 'B', 16: 'C', 17: 'B', 18: 'B', 19: 'C', 20: '410', 21: '-19', 22: 'D',
};

function doPost(e) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  const params = e.parameter || {};
  sheet.appendRow([new Date(), params.studentName || '', params.module1Score || '', params.module2Score || '', params.totalScore || '']);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}
```

Use the full version in `google-apps-script/simulacro2-results.gs` if you want every answer and TRUE/FALSE grading per question in the sheet.

## 3. Deploy The Web App

1. Click `Deploy -> New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set access to `Anyone`.
5. Deploy and copy the `/exec` URL.

## 4. Connect The React App

Create `app/.env.local` with:

```bash
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Then rebuild the app.
