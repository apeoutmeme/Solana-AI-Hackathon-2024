import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Box, Container, Typography, Grid, Card, CardContent, Button, CircularProgress, TextField, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Analytics, Psychology, Security, AutoGraph } from '@mui/icons-material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { GitHub } from '@mui/icons-material';


// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #13151a 0%, #1e2127 100%)',
}));

const AgentCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
  },
}));

const TokenSelector = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.05)',
    padding: theme.spacing(2),
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  }));

  const GitHubCard = styled(Card)(({ theme }) => ({
    marginTop: theme.spacing(4),
    background: 'rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    backdropFilter: 'blur(8px)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  }));

const ApeMindDashboard = () => {
  const { publicKey } = useWallet();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState(null);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [tokenInputValue, setTokenInputValue] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [activeAgentId, setActiveAgentId] = useState(null);
  const PRE_SELECTED_TOKENS = [
    {
      id: "ExampleToken123...",
      label: "Example Token",
      description: "Example Description"
    },
    // ...
  ];




  // Mock agent types for demonstration
  const agentTypes = [
    {
      id: 'sentiment',
      name: 'Sentiment Analyzer',
      description: 'Analyzes social media sentiment for trading signals',
      icon: <Analytics />,
      status: 'active',
    },
    {
      id: 'risk',
      name: 'Risk Manager',
      description: 'Monitors and manages trading risk exposure',
      icon: <Security />,
      status: 'active',
    },
    {
      id: 'prediction',
      name: 'Price Predictor',
      description: 'Uses ML models for price prediction',
      icon: <AutoGraph />,
      status: 'pending',
    },
    {
      id: 'neural',
      name: 'Neural Network',
      description: 'Deep learning model for pattern recognition',
      icon: <Psychology />,
      status: 'development',
    },
  ];

  useEffect(() => {
    const fetchAvailableTokens = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}`);
        const data = await response.json();
        if (data.success) {
          setAvailableTokens(data.mintAddresses.map(mint => ({
            id: mint,
            label: mint
          })));
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    if (publicKey) {
      fetchAvailableTokens();
    }
  }, [publicKey]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        // Implement your agent fetching logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setAgents(agentTypes);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [publicKey]);

  const handleTokenSelect = (event, newValue) => {
    console.log('Selected token:', newValue);
    setSelectedToken(newValue?.id || null);
  };

  if (!publicKey) {
    return (
      <StyledContainer>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
            Connect your wallet to access ApeMind
          </Typography>
          <WalletMultiButton />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Typography variant="h3" sx={{ color: 'white', mb: 4 }}>
        ApeMind Framework
      </Typography>
      <TokenSelector>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography variant="h6" sx={{ color: 'white' }}>
      Select Token to Analyze
    </Typography>
    <Button
      startIcon={<RefreshIcon />}
      onClick={() => setSelectedToken(null)}
      sx={{
        color: 'white',
        borderColor: 'rgba(255, 255, 255, 0.23)',
        '&:hover': {
          borderColor: 'white',
        },
      }}
    >
      Reset
    </Button>
  </Box>

  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
      Pre-selected Tokens
    </Typography>
    <Grid container spacing={1}>
      {PRE_SELECTED_TOKENS.map((token) => (
        <Grid item xs={12} sm={6} md={4} key={token.id}>
          <Button
            fullWidth
            variant={selectedToken === token.id ? "contained" : "outlined"}
            onClick={() => {
                setSelectedToken(token.id);
                console.log("Selected token:", token.id); // Add debug logging
            }}
            sx={{
              p: 1,
              border: '1px solid rgba(255, 255, 255, 0.23)',
              color: selectedToken === token.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
              background: selectedToken === token.id ? 
                'linear-gradient(45deg, #6366f1, #8b5cf6)' : 
                'transparent',
              '&:hover': {
                background: selectedToken === token.id ?
                  'linear-gradient(45deg, #4f46e5, #7c3aed)' :
                  'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <Box sx={{ textAlign: 'left', width: '100%' }}>
              <Typography variant="body2" noWrap>
                {token.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} noWrap>
                {`${token.id.slice(0, 4)}...${token.id.slice(-4)}`}
              </Typography>
            </Box>
          </Button>
        </Grid>
      ))}
    </Grid>
  </Box>

  <Box>
    <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
      Or Enter Custom Token Address
    </Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        value={customTokenAddress}
        onChange={(e) => setCustomTokenAddress(e.target.value)}
        placeholder="Enter token address..."
        variant="outlined"
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8b5cf6',
            },
          },
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (customTokenAddress.trim()) {
            setSelectedToken(customTokenAddress.trim());
            setCustomTokenAddress('');
          }
        }}
        sx={{
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
          },
        }}
      >
        Analyze
      </Button>
    </Box>
  </Box>
</TokenSelector>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {agents.map((agent) => (
  <React.Fragment key={agent.id}>
    <Grid item xs={12} md={6} lg={4}>
      <AgentCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {agent.icon}
            <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
              {agent.name}
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            {agent.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                color: agent.status === 'active' ? '#10b981' : '#f59e0b',
                textTransform: 'capitalize',
              }}
            >
              {agent.status}
            </Typography>
            <StyledButton
              onClick={() => {
                if ((agent.id === 'risk' || agent.id === 'sentiment') && agent.status === 'active') {
                  console.log('[Dashboard] Toggling agent:', agent.id);
                  setActiveAgentId(activeAgentId === agent.id ? null : agent.id);
                }
              }}
              disabled={agent.status !== 'active'}
            >
              {agent.status === 'active' ? 
                (activeAgentId === agent.id ? 'Hide Details' : 'View Details') : 
                'Deploy Agent'}
            </StyledButton>
          </Box>
        </CardContent>
      </AgentCard>
    </Grid>
    {selectedToken && (
      <>
        {agent.id === 'risk' && activeAgentId === 'risk' && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 4 }}>
              <RiskManagerAgent 
                activeToken={selectedToken}
              />
            </Box>
          </Grid>
        )}
        {agent.id === 'sentiment' && activeAgentId === 'sentiment' && (
          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 4 }}>
              <SentimentAnalyzerAgent 
                activeToken={selectedToken}
              />
            </Box>
          </Grid>
        )}
      </>
    )}
  </React.Fragment>
))}
        </Grid>
        
      )}

<Grid item xs={12}>
  <GitHubCard>
    <CardContent>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <GitHub sx={{ fontSize: 40, color: '#fbbf24' }} />
          <Box>
            <Typography variant="h6" sx={{ color: '#fbbf24' }}>
              ApeMind Framework
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Open-source AI trading framework for Solana
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            href="https://github.com/apeoutmeme/ApeMind-Framework"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<GitHub />}
            sx={{
              borderColor: 'rgba(251, 191, 36, 0.5)',
              color: '#fbbf24',
              '&:hover': {
                borderColor: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.1)',
              }
            }}
          >
            View Source
          </Button>
          <Button
            variant="contained"
            href="https://github.com/apeoutmeme/ApeMind-Framework/fork"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: 'linear-gradient(to right, #fbbf24, #d97706)',
              '&:hover': {
                background: 'linear-gradient(to right, #d97706, #b45309)',
              }
            }}
          >
            Fork Repository
          </Button>
        </Box>
      </Box>
    </CardContent>
  </GitHubCard>
</Grid>
      
    </StyledContainer>
  );
};

export default ApeMindDashboard;