const axios = require('axios');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const sendSlackMessage = async (text) => {
  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text,
    });
  } catch (error) {
    console.error('Error enviando mensaje a Slack:', error.message);
  }
};

module.exports = sendSlackMessage;
