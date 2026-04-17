const axios = require("axios");
const User = require("../models/user.model");
const Group = require("../models/group.model");

const BOT_URL = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

exports.handleMessage = async (message) => {
  const chatType = message.chat.type;

  // ✅ PRIVATE CHAT (User)
  if (chatType === "private") {
    const text = message.text;

    if (text && text.startsWith("/start")) {
      const telegramId = message.from.id;
      const username = message.from.username;

      const employeeId = text.split(" ")[1];

      await User.findOneAndUpdate(
        { employee_id: employeeId },
        {
          telegram_id: telegramId,
          username
        },
        { upsert: true }
      );

      // Get department group
      const group = await Group.findOne({ department: "SALES" }); // Replace dynamic later

      if (!group) {
        return sendMessage(telegramId, "No group mapped");
      }

      const inviteLink = await createInviteLink(group.group_id);

      await sendMessage(
        telegramId,
        `✅ Connected!\nJoin your group:\n${inviteLink}`
      );
    }
  }

  // ✅ GROUP MESSAGE (Manual registration)
  else {
    const text = message.text;

    if (text && text.startsWith("/register_group")) {
      const department = text.split(" ")[1];

      await Group.findOneAndUpdate(
        { department },
        {
          group_id: message.chat.id,
          group_name: message.chat.title
        },
        { upsert: true }
      );
    }
  }
};

exports.handleBotAdded = async (data) => {
  const chat = data.chat;

  if (chat.type === "group" || chat.type === "supergroup") {
    await Group.findOneAndUpdate(
      { group_id: chat.id },
      {
        group_name: chat.title
      },
      { upsert: true }
    );
  }
};

const sendMessage = async (chatId, text) => {
  await axios.post(`${BOT_URL}/sendMessage`, {
    chat_id: chatId,
    text
  });
};

const createInviteLink = async (chatId) => {
  const res = await axios.post(`${BOT_URL}/createChatInviteLink`, {
    chat_id: chatId,
    member_limit: 1,
    expire_date: Math.floor(Date.now() / 1000) + 300
  });

  return res.data.result.invite_link;
};