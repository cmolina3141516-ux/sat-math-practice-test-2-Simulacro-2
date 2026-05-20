const SPREADSHEET_ID = '1YWPa4oyxabUj5qO14baa4QrhgC8GmrP7Sp0uUIeELek';
const SHEET_NAME = 'Simulacro 2 Math';

const MODULE_1_KEY = {
  1: 'B',
  2: 'C',
  3: 'B',
  4: 'A',
  5: 'A',
  6: '9',
  7: '224',
  8: 'A',
  9: 'C',
  10: 'B',
  11: 'A',
  12: 'B',
  13: '40',
  14: '14',
  15: 'C',
  16: 'D',
  17: 'B',
  18: 'D',
  19: 'D',
  20: '52',
  21: '-3',
  22: 'B',
};

const MODULE_2_KEY = {
  1: 'B',
  2: 'B',
  3: 'D',
  4: 'B',
  5: 'D',
  6: '70',
  7: '1',
  8: 'D',
  9: 'A',
  10: 'D',
  11: 'C',
  12: 'D',
  13: '45',
  14: '2;-12',
  15: 'B',
  16: 'C',
  17: 'B',
  18: 'B',
  19: 'C',
  20: '410',
  21: '-19',
  22: 'D',
};

function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  sheet.clear();
  sheet.appendRow(buildHeaders_());
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, buildHeaders_().length);
  return sheet;
}

function doGet() {
  return json_({
    status: 'ok',
    message: 'SAT Math Simulacro 2 endpoint is active.',
  });
}

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders_(sheet);

    const params = e.parameter || {};
    const row = buildRow_(params);
    sheet.appendRow(row);

    return json_({
      result: 'success',
      message: 'Results saved.',
    });
  } catch (error) {
    return json_({
      result: 'error',
      message: String(error),
    });
  }
}

function buildHeaders_() {
  const headers = [
    'Timestamp',
    'Exam',
    'Student Name',
    'Module 1 Score',
    'Module 2 Score',
    'Total Score',
    'SAT Estimate',
    'SAT Estimate Range',
    'Spreadsheet URL',
    'Module 1 Answers JSON',
    'Module 2 Answers JSON',
  ];

  for (let i = 1; i <= 22; i++) headers.push(`M1_Q${i}_Answer`);
  for (let i = 1; i <= 22; i++) headers.push(`M1_Q${i}_Correct`);
  for (let i = 1; i <= 22; i++) headers.push(`M2_Q${i}_Answer`);
  for (let i = 1; i <= 22; i++) headers.push(`M2_Q${i}_Correct`);

  return headers;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(buildHeaders_());
    sheet.setFrozenRows(1);
  }
}

function buildRow_(params) {
  const row = [
    new Date(),
    params.exam || 'math',
    params.studentName || '',
    params.module1Score || '',
    params.module2Score || '',
    params.totalScore || '',
    params.satEstimate || '',
    params.satEstimateRange || '',
    params.spreadsheetUrl || '',
    params.module1AnswersJson || '',
    params.module2AnswersJson || '',
  ];

  for (let i = 1; i <= 22; i++) row.push(params[`M1_Q${i}`] || '');
  for (let i = 1; i <= 22; i++) row.push(isCorrect_(params[`M1_Q${i}`], MODULE_1_KEY[i]) ? 'TRUE' : 'FALSE');
  for (let i = 1; i <= 22; i++) row.push(params[`M2_Q${i}`] || '');
  for (let i = 1; i <= 22; i++) row.push(isCorrect_(params[`M2_Q${i}`], MODULE_2_KEY[i]) ? 'TRUE' : 'FALSE');

  return row;
}

function isCorrect_(studentAnswer, correctAnswer) {
  const answer = normalize_(studentAnswer);
  if (!answer) return false;

  return String(correctAnswer)
    .split(';')
    .map(normalize_)
    .some((accepted) => answer === accepted || numericMatch_(answer, accepted));
}

function normalize_(value) {
  return String(value || '')
    .trim()
    .replace(',', '')
    .toUpperCase();
}

function numericMatch_(answer, accepted) {
  const parsedAnswer = parseNumber_(answer);
  const parsedAccepted = parseNumber_(accepted);
  if (parsedAnswer === null || parsedAccepted === null) return false;
  return Math.abs(parsedAnswer - parsedAccepted) <= 0.01;
}

function parseNumber_(value) {
  if (/^-?\d+\/-?\d+$/.test(value)) {
    const parts = value.split('/');
    const numerator = Number(parts[0]);
    const denominator = Number(parts[1]);
    if (!isFinite(numerator) || !isFinite(denominator) || denominator === 0) return null;
    return numerator / denominator;
  }

  const parsed = Number(value);
  return isFinite(parsed) ? parsed : null;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
