const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
  polling: process.env.NODE_ENV !== 'production' 
});

// Set webhook for production (Heroku)
if (process.env.NODE_ENV === 'production') {
  const url = process.env.KOYEB_URL || process.env.HEROKU_URL || process.env.WEBHOOK_URL;
  bot.setWebHook(`${url}/bot${process.env.TELEGRAM_BOT_TOKEN}`);
}

// Store for user interactions
const userSessions = {};

// Helper function to format timestamp
function formatDate(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to get user info
async function getUserInfo(userId) {
  try {
    // Get basic user info
    const userInfo = await bot.getChat(userId);
    
    // Get user profile photos to estimate account age (oldest photo date)
    let accountAge = 'Unknown';
    try {
      const photos = await bot.getUserProfilePhotos(userId, { limit: 100 });
      if (photos.total_count > 0) {
        // This gives us some indication of activity, but not exact account creation date
        accountAge = `Has ${photos.total_count} profile photos`;
      }
    } catch (error) {
      console.log('Could not fetch profile photos:', error.message);
    }

    return {
      id: userInfo.id,
      username: userInfo.username || 'No username',
      firstName: userInfo.first_name || 'N/A',
      lastName: userInfo.last_name || 'N/A',
      type: userInfo.type,
      accountAge: accountAge,
      languageCode: userInfo.language_code || 'Unknown',
      isBot: userInfo.is_bot || false
    };
  } catch (error) {
    throw new Error(`Could not fetch user info: ${error.message}`);
  }
}

// Helper function to get group/channel info
async function getGroupInfo(chatId) {
  try {
    const chatInfo = await bot.getChat(chatId);
    
    // Get member count for groups/channels
    let memberCount = 'Unknown';
    try {
      const count = await bot.getChatMemberCount(chatId);
      memberCount = count.toString();
    } catch (error) {
      console.log('Could not fetch member count:', error.message);
    }

    return {
      id: chatInfo.id,
      title: chatInfo.title || 'No title',
      username: chatInfo.username || 'No username',
      type: chatInfo.type,
      description: chatInfo.description || 'No description',
      memberCount: memberCount,
      inviteLink: chatInfo.invite_link || 'No public invite link'
    };
  } catch (error) {
    throw new Error(`Could not fetch group/channel info: ${error.message}`);
  }
}

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🤖 *Welcome to Telegram Info Bot!*

I can help you get information about:
👤 Telegram users
👥 Telegram groups and channels

*Available Commands:*
/userinfo - Get information about a user
/groupinfo - Get information about a group/channel
/help - Show this help message

*How to use:*
1. Use /userinfo followed by a user ID or forward a message from the user
2. Use /groupinfo followed by a group ID or invite link
3. You can also send me a forwarded message and I'll analyze it

Let's get started! 🚀
  `;
  
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📖 *Help - How to use this bot:*

*Getting User Information:*
• \`/userinfo 123456789\` - Get info about user with ID 123456789
• \`/userinfo @username\` - Get info about user with username
• Forward any message from a user to get their info

*Getting Group/Channel Information:*
• \`/groupinfo -100123456789\` - Get info about group with ID
• \`/groupinfo https://t.me/groupname\` - Get info using invite link
• Forward a message from any group/channel

*What information can I provide:*

👤 *For Users:*
• User ID and username
• Display name (first/last name)
• Account type (user/bot)
• Language preference
• Profile photo count
• Account activity indicators

👥 *For Groups/Channels:*
• Group/Channel ID and username
• Title and description
• Member count (if accessible)
• Group type (group/supergroup/channel)
• Invite link (if public)

*Note:* Due to Telegram's privacy policies, some information might be limited or unavailable.
  `;
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// User info command
bot.onText(/\/userinfo(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1].trim();
  
  if (!input) {
    bot.sendMessage(chatId, '❌ Please provide a user ID or username.\nExample: `/userinfo 123456789` or `/userinfo @username`', 
      { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    bot.sendMessage(chatId, '🔍 Fetching user information...');
    
    let userId = input;
    
    // Handle username format
    if (input.startsWith('@')) {
      userId = input.substring(1);
    }
    
    const userInfo = await getUserInfo(userId);
    
    const infoMessage = `
👤 *User Information*

🆔 *ID:* \`${userInfo.id}\`
👤 *Username:* ${userInfo.username}
📝 *Name:* ${userInfo.firstName} ${userInfo.lastName}
🤖 *Type:* ${userInfo.isBot ? 'Bot' : 'User'}
🌐 *Language:* ${userInfo.languageCode}
📸 *Profile Activity:* ${userInfo.accountAge}

*Note:* Some information might be restricted due to user's privacy settings.
    `;
    
    bot.sendMessage(chatId, infoMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error fetching user info:', error);
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

// Group info command
bot.onText(/\/groupinfo(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1].trim();
  
  if (!input) {
    bot.sendMessage(chatId, '❌ Please provide a group ID or invite link.\nExample: `/groupinfo -100123456789` or `/groupinfo https://t.me/groupname`', 
      { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    bot.sendMessage(chatId, '🔍 Fetching group/channel information...');
    
    let groupId = input;
    
    // Handle invite link format
    if (input.includes('t.me/')) {
      const linkPart = input.split('t.me/')[1];
      groupId = `@${linkPart}`;
    }
    
    const groupInfo = await getGroupInfo(groupId);
    
    const infoMessage = `
👥 *Group/Channel Information*

🆔 *ID:* \`${groupInfo.id}\`
📝 *Title:* ${groupInfo.title}
👤 *Username:* ${groupInfo.username}
📊 *Type:* ${groupInfo.type}
👥 *Members:* ${groupInfo.memberCount}
📄 *Description:* ${groupInfo.description.substring(0, 200)}${groupInfo.description.length > 200 ? '...' : ''}
🔗 *Invite Link:* ${groupInfo.inviteLink}

*Note:* Some information might be restricted based on group/channel privacy settings.
    `;
    
    bot.sendMessage(chatId, infoMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error fetching group info:', error);
    bot.sendMessage(chatId, `❌ Error: ${error.message}`);
  }
});

// Handle forwarded messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  // Skip if it's a command
  if (msg.text && msg.text.startsWith('/')) return;
  
  // Handle forwarded messages
  if (msg.forward_from) {
    try {
      bot.sendMessage(chatId, '🔍 Analyzing forwarded message...');
      
      const userInfo = await getUserInfo(msg.forward_from.id);
      
      const infoMessage = `
👤 *Forwarded Message User Info*

🆔 *ID:* \`${userInfo.id}\`
👤 *Username:* ${userInfo.username}
📝 *Name:* ${userInfo.firstName} ${userInfo.lastName}
🤖 *Type:* ${userInfo.isBot ? 'Bot' : 'User'}
🌐 *Language:* ${userInfo.languageCode}
📸 *Profile Activity:* ${userInfo.accountAge}
      `;
      
      bot.sendMessage(chatId, infoMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error analyzing forwarded message:', error);
      bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
  }
  
  // Handle messages forwarded from channels/groups
  else if (msg.forward_from_chat) {
    try {
      bot.sendMessage(chatId, '🔍 Analyzing forwarded message from group/channel...');
      
      const groupInfo = await getGroupInfo(msg.forward_from_chat.id);
      
      const infoMessage = `
👥 *Forwarded Message Group/Channel Info*

🆔 *ID:* \`${groupInfo.id}\`
📝 *Title:* ${groupInfo.title}
👤 *Username:* ${groupInfo.username}
📊 *Type:* ${groupInfo.type}
👥 *Members:* ${groupInfo.memberCount}
      `;
      
      bot.sendMessage(chatId, infoMessage, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error analyzing forwarded group message:', error);
      bot.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Telegram Bot Error:', error);
});

// Webhook handler for production
if (process.env.NODE_ENV === 'production') {
  const express = require('express');
  const bodyParser = require('body-parser');
  
  const app = express();
  app.use(bodyParser.json());
  
  // Webhook endpoint
  app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  
  // Health check endpoint
  app.get('/', (req, res) => {
    res.send('Telegram Info Bot is running! 🤖');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

console.log('Telegram Info Bot started successfully! 🚀');
