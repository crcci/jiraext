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
            const testName = extractTestName(testcase.$.name);
            const attachments = [];

            const cdataContent = testcase['system-out'][0];

            if (cdataContent) {
              const attachmentPaths = cdataContent.match(/\[\[ATTACHMENT\|(.*?)]]/g);

              if (attachmentPaths) {
                for (const attachmentPath of attachmentPaths) {
                  const attachmentInfo = {
                    path: attachmentPath.replace(/\[\[ATTACHMENT\|(.*)]]/, '$1')
                  };
                  attachments.push(attachmentInfo);
                }
              }
            }

            failedTestCases.push({ name: testName, attachments: attachments });
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
  // Extract the test name after the last › character and before @
  const matches = fullName.match(/›\s*([^@]+)\s*@/);
  return matches ? matches[1].trim() : fullName;
}
