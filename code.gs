// Connect and configure the Access Token stored in Google Sheets
// Access the "SETTING" sheet, retrieve the file ID from cell C5 and the Line token from cell C6
let file = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SETTING");
let file_id = file.getRange("C5").getValue();
let token_line = file.getRange("C6").getValue();

let CHANNEL_ACCESS_TOKEN = token_line;
let line_endpoint = "https://api.line.me/v2/bot/message/reply";

let data_sheet = SpreadsheetApp.openById(file_id).getSheets()[0]; //Open Google Sheets by file_id
let data_table = data_sheet
  .getRange(2, 1, data_sheet.getLastRow(), data_sheet.getLastColumn()) // Check data starting from row 2, column 1 onwards
  .getValues();
let result = "Data not found"; // No matching data found

function doPost(e) {
  let json = JSON.parse(e.postData.contents);
  let message = json.events[0].message.text;
  let reply_token = json.events[0].replyToken;

  for (let i = 0; i < data_table.length; i++) {
    // Verify the received authentication code against values in column A (which stores the PRIMARY KEY)
    if (data_table[i][0] == message) {
      i = i + 2;
      //Define variables for each column, starting from column A (1), i = rownumber
      let column_A = data_sheet.getRange(i, 1).getValue();
      let column_B = data_sheet.getRange(i, 2).getValue();

      // The 'result' variable stores the Flex Message template and the leave data in JSON format
      result = { /*Flex Message leave day Here*/ }
    }
  }

  // Keyword check
  if (message == "ตรวจสอบวันลา") {  //message from user
    UrlFetchApp.fetch(line_endpoint, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
      },
      method: "post",
      payload: JSON.stringify({
        replyToken: reply_token,
        //resoponse in text format to request auth code or user's PRIMARY KEY
        messages: [
          {
            type: "text",
            text: "โปรดระบุเลขบัตรประชาชนของท่าน",
          },
        ],
      }),
    });
  }
  // Example Budget System Message
  // System will reply sub menu to user with Flex Message
  if (message == "ระบบงบประมาณและผลการปฏิบัติราชการ") {
    UrlFetchApp.fetch(line_endpoint, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
      },
      method: "post",
      payload: JSON.stringify({
        replyToken: reply_token,
        messages: [
            //Flex Message Here
        ],
      }),
    });
  }

  //If Data not found in Google Sheets, system will send message to user
  if (result == "Data not Found") {
    UrlFetchApp.fetch(line_endpoint, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
      },
      method: "post",
      payload: JSON.stringify({
        replyToken: reply_token,
        messages: [
          {
            type: "text",
            text: "Data not found",
          },
        ],
      }),
    });

    //Leave day check response
  } else {
    UrlFetchApp.fetch(line_endpoint, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
      },
      method: "post",
      payload: JSON.stringify({
        replyToken: reply_token,
        messages: [
          {
            type: "flex",
            altText: "LEAVE DAY CHECK",
            contents: result,
          },
        ],
      }),
    });
  }
  return ContentService.createTextOutput(
    JSON.stringify({ content: "OK" })
  ).setMimeType(ContentService.MimeType.JSON);
}