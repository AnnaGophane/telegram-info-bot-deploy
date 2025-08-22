# Telegram Info Bot 🤖

deploy

A comprehensive Telegram bot that provides detailed information about Telegram users, groups, and channels. Get insights about account details, group statistics, and more!

## Features 🌟

### User Information
- **User ID & Username** - Get unique identifiers
- **Display Name** - First and last name information
- **Account Type** - Distinguish between users and bots
- **Language Preference** - User's language setting
- **Profile Activity** - Profile photo count and activity indicators
- **Account Analysis** - Available account details within privacy limits

### Group/Channel Information
- **Group ID & Username** - Unique identifiers for groups/channels
- **Title & Description** - Group/channel name and description
- **Member Count** - Number of participants (when accessible)
- **Group Type** - Distinguish between groups, supergroups, and channels
- **Invite Links** - Public invitation links when available
- **Creation Details** - Available metadata about the group/channel

## Setup Instructions 🚀

### Prerequisites
- Node.js (v18 or higher)
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)
- Git for version control

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/telegram-info-bot.git
   cd telegram-info-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure your bot token**
   Edit `.env` file and add your bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
   NODE_ENV=development
   ```

5. **Run the bot**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Heroku Deployment 🌐

### Quick Deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual Deployment

1. **Create a Heroku app**
   ```bash
   heroku create your-telegram-bot-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_bot_token_here
   heroku config:set NODE_ENV=production
   heroku config:set HEROKU_URL=https://your-app-name.herokuapp.com
   ```

3. **Deploy the application**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Scale the application**
   ```bash
   heroku ps:scale web=1
   ```

## Koyeb Deployment 🚀

### Prerequisites
- A [Koyeb account](https://app.koyeb.com)
- Your GitHub repository with this code
- A Telegram Bot Token from [@BotFather](https://t.me/botfather)

### Method 1: Using Koyeb Dashboard (Recommended)

1. **Connect your GitHub repository**
   - Go to [Koyeb Dashboard](https://app.koyeb.com)
   - Click "Create App"
   - Select "GitHub" as the source
   - Connect and select your repository

2. **Configure the deployment**
   - **Build settings**: Koyeb will auto-detect Node.js
   - **Instance type**: Select `nano` (free tier available)
   - **Port**: Set to `8000` (or leave default)
   - **Health check**: Path `/` (auto-configured)

3. **Set environment variables**
   - `NODE_ENV`: `production`
   - `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather
   - `KOYEB_URL`: Will be auto-generated (like `https://your-app-name-your-org.koyeb.app`)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your bot will be live at the generated URL

### Method 2: Using Koyeb CLI

1. **Install Koyeb CLI**
   ```bash
   # macOS
   brew install koyeb/tap/koyeb
   
   # Linux/Windows
   curl -fsSL https://cli.koyeb.com/install.sh | bash
   ```

2. **Login to Koyeb**
   ```bash
   koyeb login
   ```

3. **Create secrets for environment variables**
   ```bash
   koyeb secrets create TELEGRAM_BOT_TOKEN --value "your_bot_token_here"
   ```

4. **Deploy using the configuration file**
   ```bash
   koyeb apps create telegram-info-bot --git github.com/yourusername/telegram-info-bot
   ```

### Method 3: Using koyeb.yaml (GitOps)

The repository includes a `koyeb.yaml` file for GitOps deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Koyeb configuration"
   git push origin main
   ```

2. **Connect repository in Koyeb**
   - Enable "Auto-deploy" in your Koyeb app settings
   - Koyeb will automatically deploy when you push changes

### Koyeb Configuration Details

The `koyeb.yaml` file includes:
- **Auto-scaling**: Configured for 1 instance (can be adjusted)
- **Health checks**: HTTP health check on `/` endpoint
- **Region**: Frankfurt (fra) - can be changed to other regions
- **Instance type**: Nano (free tier compatible)
- **Environment variables**: Properly configured for production

### Koyeb Advantages
- ✅ **Free tier available** with generous limits
- ✅ **Global edge locations** for better performance
- ✅ **Auto-scaling** based on traffic
- ✅ **Zero-downtime deployments**
- ✅ **Built-in SSL/TLS** certificates
- ✅ **Git-based deployments** with auto-deploy
- ✅ **Multiple regions** available worldwide

## Heroku Deployment 🌐 (Alternative)

### Quick Deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Manual Deployment

1. **Create a Heroku app**
   ```bash
   heroku create your-telegram-bot-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_bot_token_here
   heroku config:set NODE_ENV=production
   heroku config:set HEROKU_URL=https://your-app-name.herokuapp.com
   ```

3. **Deploy the application**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Scale the application**
   ```bash
   heroku ps:scale web=1
   ```

## Usage Guide 📖

### Basic Commands

- `/start` - Welcome message and bot introduction
- `/help` - Detailed help and command list
- `/userinfo <user_id>` - Get information about a specific user
- `/groupinfo <group_id>` - Get information about a group/channel

### Examples

**Getting User Information:**
```
/userinfo 123456789
/userinfo @username
```

**Getting Group/Channel Information:**
```
/groupinfo -100123456789
/groupinfo https://t.me/groupname
/groupinfo @channelname
```

**Using Forwarded Messages:**
- Forward any message from a user to get their information
- Forward any message from a group/channel to get group details

## API Limitations 🔒

Due to Telegram's privacy policies and API restrictions, some information may be limited:

- **User Privacy**: Users can restrict access to their information
- **Account Age**: Exact creation date is not available through Bot API
- **Country Information**: Geographic data is not provided by Telegram Bot API
- **Group Privacy**: Some group details may be restricted based on settings

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables 🔧

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your bot token from @BotFather | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `KOYEB_URL` | Your Koyeb app URL | Yes (for Koyeb) |
| `HEROKU_URL` | Your Heroku app URL | Yes (for Heroku) |
| `WEBHOOK_URL` | Custom webhook URL | No |

## Troubleshooting 🔧

### Common Issues

1. **Bot not responding**
   - Check if `TELEGRAM_BOT_TOKEN` is correctly set
   - Ensure the bot is not polling and webhooks are properly configured

2. **Permission errors**
   - Verify the bot has necessary permissions in groups
   - Check if users have privacy settings that block information access

3. **Heroku deployment issues**
   - Ensure `Procfile` is present and correctly configured
   - Check Heroku logs: `heroku logs --tail`

4. **Koyeb deployment issues**
   - Check build logs in Koyeb dashboard
   - Ensure environment variables are properly set
   - Verify the `koyeb.yaml` configuration is correct

### Getting Help

- Check the [Telegram Bot API documentation](https://core.telegram.org/bots/api)
- Open an issue on GitHub for bug reports
- Contact the maintainers for support

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) for the excellent Telegram Bot API wrapper
- [Telegram Bot API](https://core.telegram.org/bots/api) for providing the bot platform
- The open-source community for continuous inspiration

---

**Made with ❤️ for the Telegram community**

For more information, visit our [GitHub repository](https://github.com/yourusername/telegram-info-bot).
