# ApeBuddy ChatBot 🦍

## Overview
ApeBuddy is an AI-powered trading assistant chatbot built for the Solana blockchain. It helps users interact with the BNNA token ecosystem through natural language commands, providing real-time trading capabilities, market insights, and educational content.

## Features

### 1. Trading Integration
- **Direct Trading Commands**
  - `Buy $BNNA [amount]`: Execute buy orders using Raydium
  - `Sell $BNNA [amount]`: Execute sell orders with slippage protection
  - Integrates with existing Solana wallet infrastructure
  - Real-time balance checking and transaction verification

### 2. Market Analysis
- **Real-time Price Data**
  - Integration with DexScreener API
  - Price updates with volume and liquidity information
  - Market cap tracking
  - 24h price changes

- **Social Sentiment Analysis**
  - Trading activity monitoring
  - Trend analysis (bullish/bearish indicators)
  - Recent trade visualization
  - Community sentiment tracking

### 3. Educational Content
- **Interactive Learning System**
  - Basic trading concepts
  - Risk management guidance
  - Technical analysis fundamentals
  - Token-specific information

- **Command Categories**
  ```
  • Trading Commands
    - Buy/Sell operations
    - Balance checking
    - Price inquiries
  
  • Market Analysis
    - Price data
    - Chart analysis
    - Sentiment tracking
    
  • Educational
    - Trading basics
    - Risk management
    - Analysis techniques
  ```

## Technical Implementation

### Frontend (React + Material-UI)
```jsx
// Key Components
- ApeBuddyChat (main component)
- Styled chat interface
- Real-time message handling
- Command processing
```

### Backend (Express + Solana Web3)
```javascript
// Core Features
- Solana transaction handling
- DexScreener API integration
- Trading verification
- Balance tracking
```

### APIs Integrated
- Solana Web3.js for blockchain interactions
- DexScreener for market data
- Custom trading endpoints
- Social sentiment tracking

## Architecture

### Component Structure
```
ApeBuddyChat/
├── Chat Interface
│   ├── Message Display
│   ├── Command Input
│   └── Real-time Updates
├── Trading Logic
│   ├── Order Execution
│   ├── Balance Checking
│   └── Transaction Verification
└── Market Analysis
    ├── Price Updates
    ├── Sentiment Analysis
    └── Educational Content
```

### Data Flow
1. User inputs command
2. Command processing and validation
3. API calls to relevant services
4. Transaction execution (if trading)
5. Response formatting and display
6. Real-time updates and notifications

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/apebuddy-chat
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_SOLANA_RPC=your_rpc_url
```

4. Run the development server:
```bash
npm start
```

## Usage Examples

### Trading
```javascript
// Buy BNNA tokens
"Buy $BNNA 0.1"  // Buys BNNA worth 0.1 SOL

// Sell BNNA tokens
"Sell $BNNA 1000"  // Sells 1000 BNNA tokens
```

### Market Analysis
```javascript
// Check price
"Price $BNNA"  // Shows current price and metrics

// View sentiment
"Sentiment"  // Displays market sentiment analysis
```

### Learning
```javascript
// Get trading education
"Learn trading"  // Shows trading basics

// Specific topics
"Learn risk"  // Explains risk management
```

## Security Features
- Wallet connection verification
- Transaction signing security
- API rate limiting
- Error handling and validation

## Future Enhancements
1. Advanced chart visualization
2. Price alerts system
3. Portfolio tracking
4. Enhanced social analysis
5. More educational content

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Team
- Developers: @safudev3000, @genogrand
- Project Duration: Started: Dec 18th - Dec 23rd
- Contact: @capcryptoflint (TG) | apeoutcrypto@gmail.com

## Acknowledgments
- Solana Foundation
- Raydium Protocol
- DexScreener API
