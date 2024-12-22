# ApeSass Bot 🦍

## Hackathon Project: Building the Most Unhinged Trading Assistant 🏆
This project was created during the 2024 Solana AI Hackathon, where the challenge was to create an innovative trading bot that brings something unique to the community. ApeSass Bot won the "Most Likely to Start a Meme Coin" award for its creative approach to trading commentary and community engagement.

### Hackathon Details
- **Event**: Trading Bot Hackathon 2024
- **Duration**: 13 Days
- **Theme**: Innovative Trading Tools
- **Challenge**: Create a trading bot that stands out from traditional analysis tools
- **Solution**: An AI-powered sass machine that turns trading into entertainment

## Overview
ApeSass Bot is an unhinged AI trading assistant that brings humor to the world of trading through automated Twitter interactions. It generates meme-worthy trading "advice" and maintains a leaderboard of the most outrageous gains and losses.

## Technical Implementation 🛠️

### Architecture
```
ApeSassBot/
├── src/
│   ├── __init__.py
│   ├── bot.py           # Main bot implementation
│   ├── phrases.py       # Trading phrase templates
│   └── utils.py         # Helper functions
├── tests/
│   └── test_bot.py      # Unit tests
├── config/
│   └── config.yaml      # Configuration settings
└── main.py             # Entry point
```

### Key Components
1. **Tweet Generator**
   - Uses template system with dynamic ticker insertion
   - Sentiment analysis mapping to phrase categories
   - Random selection with weighted probabilities

2. **Twitter Integration**
   - Async implementation for better performance
   - Rate limiting handling
   - Error recovery system

3. **Leaderboard System**
   - In-memory database using defaultdict
   - Sorted data structure for efficient ranking
   - Automatic formatting and emoji mapping

4. **CLI Interface**
   - Async command processing
   - Error handling with user-friendly messages
   - Color-coded output (when supported)

## Features 🚀

### Mock Trading Advice Generator
- Generates humorous trading suggestions using pre-defined templates
- Supports three sentiment modes:
  - 🌕 Bullish (To the moon!)
  - 📉 Bearish (Pain train incoming)
  - 🎲 Neutral (Pure chaos)
- Includes emojis and meme-culture references

### Social Media Integration
- Automated Twitter posting
- Error handling with sass
- Leaderboard system for tracking community gains/losses

### Interactive CLI
- Easy-to-use emoji-rich interface
- Multiple operation modes
- User-friendly prompts with attitude

## Installation 💻

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ape-sass-bot.git
cd ape-sass-bot
```

2. Install dependencies:
```bash
pip install tweepy
```

3. Configure your Twitter API credentials:
- Create a Twitter Developer account
- Create a new app to get your API keys
- Replace the placeholder credentials in `main()`:
  - API_KEY
  - API_SECRET
  - ACCESS_TOKEN
  - ACCESS_TOKEN_SECRET

## Troubleshooting Guide 🔧

### Common Issues and Solutions

1. **Twitter API Authentication Errors**
   ```python
   tweepy.errors.Unauthorized: 401 Unauthorized
   ```
   **Solution**: 
   - Verify API credentials are correctly copied
   - Check if tokens have expired
   - Ensure app has correct permissions (Read + Write)

2. **Rate Limiting**
   ```python
   tweepy.errors.TooManyRequests: 429 Too Many Requests
   ```
   **Solution**:
   - Implement exponential backoff
   - Add delay between requests
   - Monitor API usage limits

3. **Tweet Length Errors**
   ```python
   tweepy.errors.BadRequest: 400 Bad Request
   ```
   **Solution**:
   - Check tweet length (max 280 characters)
   - Verify no invalid characters
   - Ensure media attachments are valid

## Extended Examples 📝

### Trading Advice Examples:

#### Bullish Sentiment
```
🚀 ASTRONOMICAL ALERT! BTC looking thicc! Time to YOLO your life savings! (Not financial advice, I eat crayons) 🖍️
🦍 Apes together strong! ETH making me feel some type of way... MOON SOON! 🌕
💎 These diamond hands are tingling! SOL bout to make us all look like genius smooth-brains! 🧠
```

#### Bearish Sentiment
```
🔥 DOGE chart looking like my dating life - straight DOWN! Time to short everything! 📉
💩 SHIB giving me major 'this is fine' vibes. Quick, panic sell! (jk... unless?) 🤔
🎢 APE holders, welcome to the pain train! Choo choo! 🚂
```

#### Neutral Sentiment
```
🎰 ADA looking mysterious... Time to flip a coin for financial advice! 🪙
🎮 DOT trading like it's a game of Pong - nobody knows which way this is going! 🏓
🎯 AVAX analysis: Lines go right... sometimes up, sometimes down. That'll be $499 for my premium course! 📚
```

### Leaderboard Examples:
```
🏆 APE LEADERBOARD 🏆

🦍 Diamond_Hands: +$42,069.00 / -$1,337.00
    Best Trade: BTC_LONG (+$15,420)
    Worst Trade: DOGE_SHORT (-$420)

🦍 Moon_Boi: +$12,345.67 / -$420.69
    Best Trade: ETH_LONG (+$8,008)
    Worst Trade: SHIB_LONG (-$69)

🦍 YOLO_Master: +$8,008.55 / -$69.42
    Best Trade: SOL_SHORT (+$4,242)
    Worst Trade: APE_LONG (-$13.37)
```

## Future Enhancements 🔮
- Voice command integration (coming soon)
- Technical analysis parody features
- More meme-worthy responses
- Integration with other social media platforms
- Real-time price tracking with sassy commentary

## Disclaimer ⚠️
This bot is for entertainment purposes only. It eats crayons and is not a financial advisor. Any resemblance to actual financial advice is purely coincidental and probably wrong.

## Contributing 🤝
Feel free to submit pull requests with:
- New trading phrases
- Additional meme references
- More emoji combinations
- Enhanced sass levels

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Add your sassiest features
4. Submit a pull request
5. Wait for review by our team of crayon connoisseurs

## License 📜
MIT License - Feel free to create your own army of sassy trading bots!

## Acknowledgments 🙏
- Trading Bot Hackathon organizers
- The amazing meme community
- All the diamond-handed traders out there
- Various crayons consumed during development

## Contact 📫
- Twitter: [@ApeSassBot](https://twitter.com/ApeSassBot)
- GitHub Issues: [Report Bugs](https://github.com/apeoutmeme/Solana-AI-Hackathon-2024/issues)
