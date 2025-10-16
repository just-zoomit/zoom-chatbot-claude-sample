const axios = require('axios');
const { getChatbotToken } = require('./zoomAuth');
const { sendChatToZoom } = require('./sendChatbotMessage');

let conversationHistory = {}; // Keeps track per user JID

// Function to handle communication with the Anthropic API (Claude 3)
async function callAnthropicAPI(payload) {
  const userJid = payload?.toJid;
  if (!userJid) {
    console.error("Error: payload.toJid is missing.");
    return;
  }

  try {
    // Ensure conversation history is an array of messages
    const history = conversationHistory[userJid] || [];

    // Add the new user message
    history.push({ role: "user", content: payload.cmd });

    const requestData = {
      model: "claude-3-opus-20240229", // you can swap to claude-3-sonnet or claude-3-haiku
      max_tokens: 1000,
      messages: history,
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing ANTHROPIC_API_KEY in environment variables.");
    }

    const baseURL = "https://api.anthropic.com/v1/messages";
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01", // required for Claude 3 API
    };

    const response = await axios.post(baseURL, requestData, { headers });

    if (!response?.data?.content || !Array.isArray(response.data.content)) {
      throw new Error(`Unexpected response from Anthropic API: ${JSON.stringify(response.data)}`);
    }

    // Claude 3 returns an array of content blocks (e.g. text, images, etc.)
    const completion = response.data.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n");

    // Save updated conversation history (including assistant response)
    history.push({ role: "assistant", content: completion });
    conversationHistory[userJid] = history;

    // Send to Zoom
    try {
      const chatbotToken = await getChatbotToken();
      await sendChatToZoom(chatbotToken, completion, payload);
    } catch (zoomError) {
      console.error("Error sending message to Zoom:", zoomError.message || zoomError);
    }

  } catch (error) {
    if (error.response) {
      console.error("Anthropic API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("No response from Anthropic API:", error.request);
    } else {
      console.error("Error calling Anthropic API:", error.message);
    }
  }
}

module.exports = { callAnthropicAPI };
