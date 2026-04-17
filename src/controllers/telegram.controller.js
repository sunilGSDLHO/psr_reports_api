const telegramService = require("../services/telegram.service");

exports.webhook = async (req, res) => {
  try {
    const update = req.body;

    if (update.message) {
      await telegramService.handleMessage(update.message);
    }

    if (update.my_chat_member) {
      await telegramService.handleBotAdded(update.my_chat_member);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};