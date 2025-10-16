require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // ✅ Import path
const { handleZoomWebhook } = require('./src/zoomWebhookHandler');

const app = express();
const port = process.env.PORT || 4000;

// Parse JSON
app.use(bodyParser.json());

// Serve static files from public folder (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Root route -> serve browser-version.html
app.get('/', (req, res) => {
  const zoomDeepLink =
    process.env.robot_ZOOM_BOT_JID ||
    "https://zoom.us/launch/chat?jid=robot_example@xmpp.zoom.us";

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Zoom App – Browser Version</title>
        <link rel="stylesheet" href="/styles.css" /> <!-- ✅ import CSS -->
      </head>
      <body>
        <h1>Zoom Team Chat Chatbot</h1>
        <p>This page is only a placeholder when viewed in a regular browser.</p>
        <p>To use this app, open it inside the Zoom client where it is fully supported.</p>
        <p class="note">Click the button below to launch the Zoom Team Chatbot app in the Zoom Client.</p>

        <button id="open-in-zoom" type="button">Open in Zoom</button>

        <script>
          document.getElementById("open-in-zoom").addEventListener("click", () => {
            window.open("${zoomDeepLink}", "_blank", "noopener");
          });
        </script>
      </body>
    </html>
  `);
});

// Webhook endpoint for Zoom events
app.post('/anthropic', handleZoomWebhook);

app.listen(port, () => {
  console.log(`Zoom for Team Chat listening on http://localhost:${port}`);
});
