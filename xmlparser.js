import fs from 'fs';
import { parseString } from 'xml2js';

const xmlData = fs.readFileSync('results.xml', 'utf-8');

parseString(xmlData, function(err, result) {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
  
    const failedTestCases = [];
  
    if (result.testsuites && result.testsuites.testsuite) {
      const testSuites = result.testsuites.testsuite;
  
      for (const testsuite of testSuites) {
        if (testsuite.testcase) {
          for (const testcase of testsuite.testcase) {
            if (testcase.failure && testcase['system-out']) {
              let testName = extractTestName(testcase.$.name);
              console.log('Test name:', testName); // Debugging statement
              const testId = extractTestId(testName);
              console.log('Test ID:', testId); // Debugging statement
              testName = testName.replace(/Test-ID:\d+/, '').trim(); // Remove Test-ID from test name
  
              const attachments = [];
  
              const cdataContent = testcase['system-out'][0];
  
              if (cdataContent) {
                const attachmentPaths = cdataContent.match(/\[\[ATTACHMENT\|(.*?)]]/g);
  
                if (attachmentPaths) {
                  for (const attachmentPath of attachmentPaths) {
                    if (attachmentPath.includes('-retry1')) { // Only include attachments with "-retry1"
                      const attachmentInfo = {
                        path: attachmentPath.replace(/\[\[ATTACHMENT\|(.*)]]/, '$1')
                      };
                      attachments.push(attachmentInfo);
                    }
                  }
                }
              }
  
              // Add to array regardless of whether there are attachments or not
              failedTestCases.push({ test_id: testId, name: testName, attachments: attachments });
            }
          }
        }
      }
    }
  
    const jsonOutput = JSON.stringify({ failed_test_cases: failedTestCases }, null, 2);
  
    fs.writeFileSync('failed_test_cases.json', jsonOutput);
    console.log('JSON file with failed test cases and attachments created.');
  });
  

function extractTestName(fullName) {
    const matches = fullName.match(/›\s*([^@]+)\s*@/);
    return matches ? matches[1].trim() : fullName;
}
  

function extractTestId(testName) {
  console.log('Extracting test ID from:', testName); // Debugging statement
  const matches = testName.match(/Test-ID:(\d+)/);
  const result = matches ? matches[1] : 'Unknown';
  console.log('Extracted test ID:', result); // Debugging statement
  return result;
}
