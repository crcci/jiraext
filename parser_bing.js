parseString(xmlData, function(err, result) {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
  
    const failedTestCases = new Map();
  
    if (result.testsuites && result.testsuites.testsuite) {
      const testSuites = result.testsuites.testsuite;
  
      for (const testsuite of testSuites) {
        if (testsuite.testcase) {
          for (const testcase of testsuite.testcase) {
            if (testcase.failure && testcase['system-out']) {
              const testName = extractTestName(testcase.$.name);
              const testId = extractTestId(testName);
  
              if (!failedTestCases.has(testId)) {
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
  
                if (attachments.length > 0) { // Only add to map if there are attachments
                  failedTestCases.set(testId, { test_id: testId, name: testName, attachments: attachments });
                }
              }
            }
          }
        }
      }
    }
  
    const jsonOutput = JSON.stringify({ failed_test_cases: Array.from(failedTestCases.values()) }, null, 2);
  
    fs.writeFileSync('failed_test_cases.json', jsonOutput);
    console.log('JSON file with failed test cases and attachments created.');
  });
  