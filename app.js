// Circleci vs Github User mapping file (jira-user-id: github-username)
// 
// get CircleCI_USER from the deployment job
// 
// Parse xml file
// Make a list of failed test cases
// filter the list, remove duplicates for other browsers
// 
// Ticket Creation
// check jira if another ticket exist for the same test_id
// if exists
//    // get issue_id of existing ticket
      // update ticket with new assignee(or new comment)?
      // update ticket with new attachments
// if not exist
      // create new ticket (title, test-id, assignee)
      // get new issue-id and add new attachments 




const TOKEN = "ATATT3xFfGF09tpZWqXFgVv4Lfs8yn-lshWgpr5atwWsC_dej9srcbh-ziS0Y9UfCmMA9pO9SX3eD4LfOTB_4UA97fM-x_su6TZ4HPey_ejsiXLzRNZDNraSUFUi0toWVla0U2VLmsnXeuo2khVTvp6nhJ-4AFa-eIU1OEEpeRoo8IyhaphiSCc=E8436950"
const DOMAIN = "https://platformqa.atlassian.net"
const EMAIL = "johnnurcan@gmail.com"
// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
// const fetch = require('node-fetch');



import fetch from 'node-fetch';

fetch(`${DOMAIN}/rest/api/3/project`, {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${Buffer.from(
      `${EMAIL}:${TOKEN}`
    ).toString('base64')}`,
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));