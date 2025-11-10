# GymBot Deployment Guide - Render.com

This guide will walk you through deploying GymBot to Render.com.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account with the GymBot repository
- A Render.com account (free tier available)
- Your Telegram Bot Token from [@BotFather](https://t.me/botfather)
- A MongoDB Atlas connection string

## Step 1: Prepare Your Repository

1. **Commit all changes to GitHub:**
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. **Verify your `.env.example` file exists** (this helps others set up the project):
```env
BOT_TOKEN=your_telegram_bot_token_here
MONGO_URI=your_mongodb_connection_string_here
NODE_ENV=production
```

## Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (recommended) or email
3. Verify your email address

## Step 3: Create a New Web Service

1. Click **"New +"** in the top right corner
2. Select **"Web Service"**
3. Connect your GitHub account if you haven't already
4. Find and select your **GymBot** repository
5. Click **"Connect"**

## Step 4: Configure Your Web Service

### Basic Settings:
- **Name**: `gymbot` (or your preferred name)
- **Region**: Select closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Advanced Settings:
- **Plan**: Select **Free** (sufficient for most use cases)
- **Auto-Deploy**: Enable (recommended)

## Step 5: Add Environment Variables

Click on **"Environment"** tab and add the following variables:

1. **BOT_TOKEN**
   - Key: `BOT_TOKEN`
   - Value: Your Telegram bot token from BotFather
   - Example: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

2. **MONGO_URI**
   - Key: `MONGO_URI`
   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/gymbot?retryWrites=true&w=majority`

3. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

**Important**: Click **"Save Changes"** after adding each variable.

## Step 6: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will automatically start the deployment process
3. Monitor the deployment logs in real-time

**Expected deployment time**: 2-5 minutes

## Step 7: Verify Deployment

### Check Deployment Logs:
Look for these success messages in the logs:
```
==> Building...
==> Installing dependencies...
==> Starting service...
✅ Connected to MongoDB
```

### Test Your Bot:
1. Open Telegram
2. Search for your bot by username
3. Send `/start` command
4. Verify the bot responds correctly

## Step 8: Configure Webhook (Optional but Recommended)

Since Render provides a public URL, you can configure a webhook instead of polling:

1. Get your Render URL: `https://your-service-name.onrender.com`
2. Update your bot code to use webhooks (if not already configured)

## Troubleshooting

### Bot not responding:
- **Check logs**: Go to Render dashboard → Your service → Logs
- **Verify environment variables**: Ensure BOT_TOKEN and MONGO_URI are correct
- **Check MongoDB**: Ensure your IP is whitelisted in MongoDB Atlas (use `0.0.0.0/0` for all IPs)

### MongoDB connection errors:
```
Error: Authentication failed
```
**Solution**: Verify your MongoDB credentials in the connection string

### Build failures:
```
Error: Cannot find module 'xyz'
```
**Solution**: Ensure all dependencies are in `package.json` and committed to Git

### Free tier limitations:
- **Sleeping**: Free services sleep after 15 minutes of inactivity
- **Cold starts**: May take 30-60 seconds to wake up
- **Solution**: Upgrade to paid plan or use a monitoring service to ping your service

## Keep Your Service Active (Free Tier)

Render's free tier sleeps after 15 minutes. To keep it active:

### Option 1: UptimeRobot (Recommended)
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Create a new monitor
3. Set URL to your Render service URL
4. Set interval to 5 minutes

### Option 2: Cron-job.org
1. Sign up at [cron-job.org](https://cron-job.org)
2. Create a new cronjob
3. Set URL to your Render service URL
4. Set schedule to every 5 minutes

## Update Your Bot

### Automatic Updates (Recommended):
1. Make changes to your code locally
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update feature X"
git push origin main
```
3. Render will automatically redeploy (if Auto-Deploy is enabled)

### Manual Deploy:
1. Go to Render dashboard
2. Select your service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

## Monitoring and Logs

### View Real-time Logs:
1. Go to your service in Render dashboard
2. Click on **"Logs"** tab
3. Monitor bot activity and errors

### Set Up Alerts:
1. Go to **"Settings"** → **"Notifications"**
2. Enable email notifications for:
   - Deploy failures
   - Service crashes
   - Health check failures

## Security Best Practices

1. **Never commit `.env` file** to Git (already in `.gitignore`)
2. **Rotate tokens periodically** (every 3-6 months)
3. **Use MongoDB IP whitelist** (or limit to Render IPs if possible)
4. **Enable 2FA** on Render and MongoDB accounts
5. **Monitor logs** for suspicious activity

## Scaling

When you're ready to scale:

### Upgrade Plan:
- **Starter ($7/month)**: No sleeping, better performance
- **Standard ($25/month)**: More resources, custom domains

### Add Health Checks:
Create an endpoint in your bot to respond to health checks:
```javascript
// Add to your bot code
bot.use(async (ctx, next) => {
  if (ctx.update.message?.text === '/health') {
    await ctx.reply('OK');
    return;
  }
  return next();
});
```

## Production Checklist

Before going live:
- [ ] All environment variables configured correctly
- [ ] MongoDB connection working
- [ ] Bot responds to `/start` command
- [ ] Tested all main features (workout generation, history, settings)
- [ ] Seeded exercise database (92 exercises)
- [ ] Logs show no errors
- [ ] Auto-deploy enabled
- [ ] README updated with live bot link
- [ ] Uptime monitor configured (if using free tier)

## Support

If you encounter issues:
1. Check Render [status page](https://status.render.com/)
2. Review Render [documentation](https://render.com/docs)
3. Check MongoDB Atlas [status](https://status.cloud.mongodb.com/)
4. Review deployment logs carefully
5. Test locally with same environment variables

## Next Steps After Deployment

1. **Update README.md** with your live bot link
2. **Test thoroughly** with different commands and scenarios
3. **Share on LinkedIn** using the prepared post templates
4. **Gather user feedback** and iterate
5. **Monitor performance** and user engagement

---

**Congratulations!** Your GymBot is now live and accessible worldwide through Telegram.
