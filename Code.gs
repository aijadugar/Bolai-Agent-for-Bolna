// =======================================================
// GLOBAL CONFIGURATION VARIABLES
// =======================================================
const SHEET_NAME = 'Sheet1';
const BOLNA_API_KEY = 'your-api-key';
const BOLNA_AGENT_ID = 'your-agent-id'; 

const COLUMN_INDEX = {
  PHONE_NUMBER: 1, // A
  STATUS: 2,       // B
  CALL_ID: 3,      // C
  SUMMARY: 4       // D
};

const BOLNA_API_URL = 'https://api.bolna.ai/call'; 

/**
 * =======================================================
 * 2. triggerCalls() - CALL INITIATOR (TRIGGERS API CALLS TO BOLNA)
 * =======================================================
 * This function loops through the sheet and initiates the call using the Bolna API.
 */
function triggerCalls() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues(); 

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1; 
    let phoneNumber = row[COLUMN_INDEX.PHONE_NUMBER - 1];
    phoneNumber = String(phoneNumber).trim();
    if (phoneNumber.length === 10 && !phoneNumber.startsWith('+')){
      phoneNumber = '+91' + phoneNumber;
    }
    const status = row[COLUMN_INDEX.STATUS - 1];
    
    if (phoneNumber && phoneNumber.toString().startsWith('+') && (!status || status.toLowerCase() === 'pending' || status.toLowerCase() === 'api failed')) {
      
      const payload = {
        "agent_id": BOLNA_AGENT_ID,
        "recipient_phone_number": phoneNumber.toString(),
        // "from_phone_number": FROM_PHONE_NUMBER,
        "user_data": { "sheet_row": rowNum } 
      };

      const options = {
        'method': 'post',
        'contentType': 'application/json',
        'headers': {
          'Authorization': `Bearer ${BOLNA_API_KEY}`
        },
        'payload': JSON.stringify(payload),
        'muteHttpExceptions': true
      };

      try {
        const response = UrlFetchApp.fetch(BOLNA_API_URL, options); 
        const responseCode = response.getResponseCode();
        const responseText = response.getContentText();

        if (responseCode === 200 || responseCode === 201) {
          const responseData = JSON.parse(responseText);
          const callId = responseData.execution_id || responseData.id;
          
          sheet.getRange(rowNum, COLUMN_INDEX.STATUS).setValue('initiated');
          sheet.getRange(rowNum, COLUMN_INDEX.CALL_ID).setValue(callId);
          Logger.log(`Call initiated for ${phoneNumber}. ID: ${callId}`);
          
        } else {
          sheet.getRange(rowNum, COLUMN_INDEX.STATUS).setValue(`API Failed: ${responseCode}`);
          Logger.log(`API Call failed for ${phoneNumber}. Response: ${responseText}`);
        }

      } catch (e) {
        sheet.getRange(rowNum, COLUMN_INDEX.STATUS).setValue('Script Error');
        Logger.log(`Error during API request for ${phoneNumber}: ${e.toString()}`);
      }
    }
  }
}

// Test doPost
function testDoPost() {
  const dummyPayload = {
    postData: {
      contents: JSON.stringify({
        call_id: "ef6375d1-f6e2-4f36-aa0b-2af768a4e99b",
        status: "completed",
        customer_number: "7875618947",
        summary: "User was interested and requested a follow-up" 
      })
    }
  };
  doPost(dummyPayload); 
}

/**
 * =======================================================
 * 1. doPost(e) - WEBHOOK LISTENER (RECEIVES DATA FROM BOLNA)
 * =======================================================
 * This function is triggered when Bolna's post-call webhook sends a POST request
 * to the Web App URL. It finds the row by Call ID and updates the Status and Summary.
 * * @param {object} e The event object containing the POST request data.
 */
function doPost(e) {
  try {
    
    const rawContents = e.postData.contents;
    Logger.log("Raw POST Data Contents: " + rawContents);

    const data = JSON.parse(rawContents);
    
    Logger.log("Parsed JSON Data: " + JSON.stringify(data)); 
    
    const callId = data.call_id || data.id; 
    const status = data.status; 
    const phoneNumber = data.customer_number; 

    const originalSummary = data.summary;
    const trimmedSummary = originalSummary ? originalSummary.trim() : "";

    const summaryToUse = trimmedSummary.length > 0
      ? trimmedSummary
      : 'No Summary Provided';


    if (!callId) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Missing Call ID" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const values = sheet.getDataRange().getValues();

    let rowToUpdate = -1;
    for (let i = 1; i < values.length; i++) { 
        if (values[i][COLUMN_INDEX.CALL_ID - 1] === callId) {
            rowToUpdate = i + 1;
            break;
        }
        if (rowToUpdate === -1 && values[i][COLUMN_INDEX.PHONE_NUMBER - 1] === phoneNumber) {
            rowToUpdate = i + 1;
            break;
        }
    }

    if (rowToUpdate !== -1) {
      // Update the sheet row
      sheet.getRange(rowToUpdate, COLUMN_INDEX.CALL_ID).setValue(callId);
      sheet.getRange(rowToUpdate, COLUMN_INDEX.STATUS).setValue(status);
      sheet.getRange(rowToUpdate, COLUMN_INDEX.SUMMARY).setValue(summaryToUse);
      
      Logger.log(`Updated row ${rowToUpdate} for ID: ${callId}. Status: ${status}`);
      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);

    } else {
      Logger.log(`Call ID/Phone ${callId}/${phoneNumber} not found in the sheet.`);
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: `Row not found` })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    Logger.log(`Error processing doPost: ${error.toString()}. Check the raw POST data for correct JSON formatting.`);
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: `Server Error` })).setMimeType(ContentService.MimeType.JSON);
  }
}
