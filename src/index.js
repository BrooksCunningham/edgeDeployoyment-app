/// <reference types="@fastly/js-compute" />

import { Router } from "@fastly/expressly";

const ngwafApiOrigin = "ngwaf_api_origin";

const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>edgeDeployment App</title>
</head>
<body>
  <h1>edgeDeployment App</h1>
  <form id="myForm">
    <label for="SIGSCI_EMAIL">SIGSCI_EMAIL:</label>
    <input type="text" id="SIGSCI_EMAIL" name="SIGSCI_EMAIL" required><br>
    <label for="SIGSCI_TOKEN">SIGSCI_TOKEN:</label>
    <input type="password" id="SIGSCI_TOKEN" name="SIGSCI_TOKEN" required><br>
    <label for="corpName">corpName:</label>
    <input type="text" id="corpName" name="corpName" required><br>
    <label for="siteName">siteName:</label>
    <input type="text" id="siteName" name="siteName" required><br>
    <label for="fastlySID">fastlySID:</label>
    <input type="text" id="fastlySID" name="fastlySID" required><br>
    <label for="fastlyKey">fastlyKey:</label>
    <input type="password" id="fastlyKey" name="fastlyKey" required type="password"><br>
    <button type="submit">Submit</button>
  </form>
  <div id="response"></div>

  <script>
    document.getElementById('myForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const SIGSCI_EMAIL = document.getElementById('SIGSCI_EMAIL').value;
      const SIGSCI_TOKEN = document.getElementById('SIGSCI_TOKEN').value;
      const corpName = document.getElementById('corpName').value;
      const siteName = document.getElementById('siteName').value;
      const fastlySID = document.getElementById('fastlySID').value;
      const fastlyKey = document.getElementById('fastlyKey').value;

      try {
        const response = await fetch('/edgeDeployment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            SIGSCI_EMAIL,
            SIGSCI_TOKEN,
            corpName,
            siteName,
            fastlySID,
            fastlyKey,
          }),
        });

        if (!response.ok) {
          throw new Error('Server request failed');
        }

        const data = await response.json();
        document.getElementById('response').innerText = \`API Response: \${JSON.stringify(data)}\`;
      } catch (error) {
        console.error(error);
      }
    });
  </script>
</body>
</html>
`;

const router = new Router();

// Use middleware to set a header
router.use((req, res) => {
  res.set("x-powered-by", "expressly");
});

// GET 200 response
router.get('/', (req, res) => {
  // res.sendStatus(200); // "OK"
  res.set("content-type", "text/html");
  res.send(indexHTML);
});

// POST simple message
router.post("/submit", async (req, res) => {
  let body = await req.text();

  res.send(body);
})

router.post("/edgeDeployment", async (req, res) => {

  const { 
    SIGSCI_EMAIL,
    SIGSCI_TOKEN,
    corpName,
    siteName,
    fastlySID,
    fastlyKey,
  } = await req.json();

  // const SIGSCI_EMAIL = "your-email@example.com"; // Replace with your actual email
  // const SIGSCI_TOKEN = "your-api-token"; // Replace with your actual API token
  // const corpName = "your-corp-name"; // Replace with your corp name
  // const siteName = "your-site-name"; // Replace with your site name
  // const fastlySID = "your-corp-name"; // Replace with your corp name
  // const fastlyKey = "your-site-name"; // Replace with your site name

  const respEdgeDeployment = await edgeDeployment(SIGSCI_EMAIL, SIGSCI_TOKEN, corpName, siteName);
  const edgeDeploymentText = await respEdgeDeployment.json();

  const respEdgeDeploymentService = await edgeDeploymentService(SIGSCI_EMAIL, SIGSCI_TOKEN, corpName, siteName, fastlySID, fastlyKey);
  const edgeDeploymentServiceText = await respEdgeDeploymentService.json();

  const resp = {
    edgeDeploymentText,
    edgeDeploymentServiceText
  };

  res.send(JSON.stringify(resp));
})

// 404/405 response for everything else

router.listen();


// curl -H "x-api-user:${SIGSCI_EMAIL}" -H "x-api-token:${SIGSCI_TOKEN}" \
// -H "Content-Type: application/json" -X PUT \
// "https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment"

async function edgeDeployment(SIGSCI_EMAIL, SIGSCI_TOKEN, corpName, siteName) {
  
  const url = `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment`;
  
  const headers = {
    'x-api-user': SIGSCI_EMAIL,
    'x-api-token': SIGSCI_TOKEN,
    'Content-Type': 'application/json',
  };
  
  const options = {
    method: 'PUT',
    headers: headers,
    backend: ngwafApiOrigin
  };
  
  const resp = await fetch(url, options);
  
  return resp;
}

async function edgeDeploymentService(SIGSCI_EMAIL
  , SIGSCI_TOKEN
  , corpName
  , siteName
  , fastlySID
  , fastlyKey) {
  
  const url = `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment/${fastlySID}`;
  
  const headers = {
    'x-api-user': SIGSCI_EMAIL,
    'x-api-token': SIGSCI_TOKEN,
    'Content-Type': 'application/json',
    'Fastly-Key': fastlyKey
  };
  
  const options = {
    method: 'PUT',
    headers: headers,
    backend: ngwafApiOrigin
  };
  
  const resp = await fetch(url, options);
  
  return resp;

  // const responsePromise = fetch(req, {
  //   backend: ""
  // })
}

