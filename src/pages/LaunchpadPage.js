/**
 * LaunchpadPage Component
 * 
 * Implementation Requirements:
 * 1. Environment Variables:
 *    - REACT_APP_API_URL: Base URL for API endpoints
 * 
 * 2. Required API Endpoints:
 *    - /api/market-trends
 *    - /api/analyze-launch
 *    - /api/send-presale
 *    - /api/confirm-presale
 *    - /api/bnna-balance/${walletAddress}
 * 
 * 3. Required Components:
 *    - TokenAnalytics: Component for displaying token analysis
 * 
 * 4. Wallet Integration:
 *    - Requires Solana wallet adapter setup
 *    - Requires wallet connection handling
 * 
 * This is a template implementation. Actual implementation should include:
 * - Proper error handling
 * - Rate limiting
 * - Input validation
 * - Security measures for transactions
 * - Proper API authentication
 */


import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Security,
  Rocket,
  AttachMoney,
  Web,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import logo from '../assets/logo-tp.png'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom'; 
import { Home } from '@mui/icons-material';
import { TextField, Modal, LinearProgress } from '@mui/material';
import bananaBillImage from '../assets/bananabill/christmas.webp'
import ballsFullImage from '../assets/bfull.webp'
import huketuahImage from '../assets/huketuah.png'
import { toast } from 'react-toastify';
import TokenAnalytics from '../components/TokenAnalytics';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GitHub } from '@mui/icons-material';



const LogoImage = styled('img')({
    width: '120px', // Adjust size as needed
    height: 'auto',
    marginBottom: '1rem',
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-10px)',
      },
    },
  });

  const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    background: 'linear-gradient(135deg, #13151a 0%, #1a1d24 100%)',
    minHeight: '100vh',
  }));
  
  const FeatureCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.2)',
    },
  }));
  
  const ProjectCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      background: 'rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 24px rgba(255, 215, 0, 0.2)',
    },
  }));
  
  const ProjectImage = styled('img')({
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  });
  
  const StatusChip = styled(Chip)(({ status }) => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: status === 'LIVE' 
      ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    color: status === 'LIVE' ? '#13151a' : '#ffffff',
    fontWeight: 'bold',
  }));
  const NavContainer = styled(Box)({
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
  });

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

  const PresaleModal = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#1a1d24',
    border: '2px solid rgba(197, 158, 87, 0.1)',
    borderRadius: '16px',
    padding: theme.spacing(4),
    backdropFilter: 'blur(10px)',
  }));
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';



  const LaunchpadPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);
    const [selectedPresale, setSelectedPresale] = useState(null);
    const [amount, setAmount] = useState('');
    const { publicKey, signTransaction } = useWallet();
    const [isCheckingBnna, setIsCheckingBnna] = useState(false);
    const [analysisStates, setAnalysisStates] = useState({});


    const handleAnalyzeProject = async (projectId) => {
      const project = upcomingProjects.find(p => p.id === projectId);
      if (!project) {
          console.error('Project not found');
          return;
      }
  
      setAnalysisStates(prev => ({
          ...prev,
          [projectId]: { loading: true, error: null }
      }));
  
      try {
          // Fetch market trends
          const trendsResponse = await fetch(`${API_URL}`);
          const trendsData = await trendsResponse.json();
  
          // Analyze token launch
          const analysisResponse = await fetch(`${API_URL}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  tokenInfo: {
                      name: project.name,
                      description: project.description,
                      type: 'memecoin',
                      supply: project.presale?.totalSupply,
                      // Add any other required fields
                      launchDate: project.launchDate,
                      status: project.status
                  }
              }),
          });
  
          if (!analysisResponse.ok) {
              const errorData = await analysisResponse.json();
              throw new Error(errorData.error || 'Failed to analyze token');
          }
  
          const analysisData = await analysisResponse.json();
          
          // Combine market trends with analysis data
          const combinedAnalysis = {
              ...analysisData.analysis,
              trends: trendsData.analysis.trends
          };
  
          setAnalysisStates(prev => ({
              ...prev,
              [projectId]: { 
                  loading: false, 
                  error: null, 
                  analysis: combinedAnalysis
              }
          }));
  
      } catch (err) {
          console.error('Error analyzing token:', err);
          setAnalysisStates(prev => ({
              ...prev,
              [projectId]: { 
                  loading: false, 
                  error: err.message 
              }
          }));
      }
  };

    const handleHomeNavigation = () => {
      setIsNavigating(true);
      window.location.href = '/'; // This will force a full page refresh
    };
    const handlePresaleSubmit = async (presaleInfo) => {
      try {
        if (!publicKey) {
          toast.error('Please connect your wallet first');
          return;
        }
    
        if (!amount || isNaN(parseFloat(amount))) {
          toast.error('Please enter a valid amount');
          return;
        }
    
        const loadingToast = toast.loading('Processing your transaction...');
    
        // Step 1: Get the transaction from the server
        const response = await fetch('/api/url/for/presale', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            recipientAddress: presaleInfo.wallet,
            senderAddress: publicKey.toString(),
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          toast.dismiss(loadingToast);
          throw new Error(errorData.error || 'Failed to create transaction');
        }
    
        const data = await response.json();
        
        // Step 2: Deserialize and sign the transaction
        try {
          // Create Transaction object from base64 string
          const transaction = Transaction.from(
            Buffer.from(data.transaction, 'base64')
          );
          
          // Sign the transaction
          const signedTx = await signTransaction(transaction);
          
          // Step 3: Send the signed transaction back to server
          const confirmResponse = await fetch('/api/confirm-presale', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransaction: signedTx.serialize().toString('base64'),
            }),
          });
    
          const confirmData = await confirmResponse.json();
          
          if (!confirmResponse.ok) {
            throw new Error(confirmData.error || 'Failed to confirm transaction');
          }
    
          toast.dismiss(loadingToast);
          toast.success('Transaction confirmed!');
          setSelectedPresale(null);
    
        } catch (signError) {
          toast.dismiss(loadingToast);
          console.error('Signing error:', signError);
          toast.error(signError.message || 'Failed to sign transaction');
        }
    
      } catch (error) {
        console.error('Presale error:', error);
        toast.error(error.message || 'Failed to process transaction');
        setSelectedPresale(null);
      }
    };
    const handlePresaleClick = async (presale) => {
      if (!publicKey) {
        toast.error('Please connect your wallet first');
        return;
      }
    
      setIsCheckingBnna(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/bnna-balance/${publicKey.toString()}`
        );
        const data = await response.json();
    
        if (!data.success) {
          throw new Error(data.error || 'Failed to check BNNA balance');
        }
    
        if (data.balance <= 0) {
          toast.error('You need to hold BNNA tokens to participate in presales', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
              background: '#1a1d24',
              color: 'white',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              fontSize: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
              width: '90%',
              margin: '0 auto',
            },
          });
          return;
        }
    
        // If we get here, user has BNNA tokens, so we can show the presale modal
        setSelectedPresale(presale);
      } catch (error) {
        console.error('Error checking BNNA balance:', error);
        toast.error('Failed to verify BNNA holdings');
      } finally {
        setIsCheckingBnna(false);
      }
    };
    
   
    
  
    const features = [
      {
        title: 'Secure Token Deployment',
        description: 'We handle token deployment with industry-standard security practices',
        icon: <Security style={{ color: 'white' }} fontSize="large" />,
        price: '1 SOL',
      },
      {
        title: 'Free Website',
        description: 'Get a professional website for your project at no additional cost',
        icon: <Web style={{ color: 'white' }} fontSize="large" />,
        price: 'Included',
      },
      {
        title: 'Risk Insurance Pool',
        description: 'Protection for traders through our insurance fund',
        icon: <AttachMoney style={{ color: 'white' }} fontSize="large" />,
        price: '3-30 SOL',
      },
    ];
  
    const steps = ['Project Details', 'Security Verification', 'Launch Preparation'];
    const upcomingProjects = [
        {
          id: 1,
          name: 'Example Project 1',
          description: 'Example description of a token project with community-driven features.',
          image: 'https://example.com/placeholder.png', // Replace with placeholder image
          status: 'Coming Soon',
          launchDate: '2024-12-26',
          presale: {
            cap: 100,
            raised: 35,
            minContribution: 0.001,
            maxContribution: 5,
            wallet: 'EXAMPLE_WALLET_ADDRESS_PLACEHOLDER',
            tokenPrice: 0.000001,
          },
          historicalPrices: [],
          historicalVolume: [],
          marketCap: 0,
        },
        {
          id: 2,
          name: 'Example Project 2',
          description: 'Another example project showcasing the launchpad capabilities.',
          image: 'https://example.com/placeholder2.png',
          status: 'PRE-SALE LIVE',
          launchDate: '2024-12-22',
          presale: {
            cap: 50,
            raised: 5,
            minContribution: 0.001,
            maxContribution: 5,
            wallet: 'EXAMPLE_WALLET_ADDRESS_2_PLACEHOLDER',
            tokenPrice: 0.000001,
          },
          historicalPrices: [],
          historicalVolume: [],
          marketCap: 0,
        },
      ];
  
    return (
      <StyledContainer sx={{ backgroundColor: 'black' }} maxWidth="lg">
        <Box textAlign="center" mb={6}>
        <LogoImage 
          src={logo} 
          alt="Pump.fun Logo"
        />
        <NavContainer>
      <Button
        onClick={handleHomeNavigation}
        disabled={isNavigating}
        variant="contained"
        startIcon={<Home />}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        Back Home
      </Button>
      <WalletMultiButton />
    </NavContainer>
    <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom
        sx={{ 
          background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold' 
        }}
      >
        Apeout Launchpad
      </Typography>
      <Typography variant="h6" sx={{ color: '#a0a0a0' }} paragraph>
        Launch your Solana token with enhanced security and professional support
      </Typography>
        </Box>
  
        <Grid container spacing={4} mb={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ textAlign: 'center' }}>
                  {feature.icon}
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2, color: 'white' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="white">
                    {feature.description}
                  </Typography>
                  <Chip 
                    label={feature.price}
                    color="primary"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ my: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            color: 'white', 
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold'
          }}
        >
          Upcoming Launches
        </Typography>
  
        <Grid container spacing={4}>
          {upcomingProjects.map((project) => (
            <Grid item xs={12} md={4} key={project.id}>
              <ProjectCard>
                <Box sx={{ position: 'relative' }}>
                  <ProjectImage 
                    src={project.image} 
                    alt={project.name} 
                  />
                  <StatusChip 
                    label={project.status}
                    status={project.status}
                  />
                </Box>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    {project.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="white" 
                    paragraph
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2 
                  }}>
                    <Typography 
                      variant="caption" 
                      color="white"
                    >
                      Launch Date: {new Date(project.launchDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                    <Button
                            variant="contained"
                            onClick={() => handleAnalyzeProject(project.id)}
                            disabled={analysisStates[project.id]?.loading}
                            sx={{
                                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                                color: '#13151a',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #FFA500 0%, #FFD700 100%)',
                                },
                            }}
                        >
                            {analysisStates[project.id]?.loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Analyze'
                            )}
                        </Button>
                    <Button
  variant="contained"
  fullWidth
  onClick={() => handlePresaleClick(project.presale)}
  disabled={isCheckingBnna}
  sx={{
    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
    color: '#13151a',
    '&:hover': {
      background: 'linear-gradient(90deg, #FFA500 0%, #FFD700 100%)',
    },
  }}
>
  {isCheckingBnna ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    'Join Presale'
  )}
</Button>
      </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
          <TokenAnalytics 
            projectData={{
              name: project.name,
              mintAddress: project.presale?.wallet,
              historicalData: {
                prices: project.historicalPrices || [],
                volume: project.historicalVolume || [],
                marketCap: project.marketCap || '0'
              }
            }}
            analysis={analysisStates[project.id]?.analysis}
            loading={analysisStates[project.id]?.loading}
            error={analysisStates[project.id]?.error}
            handleAnalyzeClick={() => handleAnalyzeProject(project.id)}
          />
        </Box>
                </CardContent>
              </ProjectCard>
              <Modal
      open={!!selectedPresale}
      onClose={() => setSelectedPresale(null)}
    >
      <PresaleModal>
      {!publicKey ? (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Connect your wallet to participate in presale
          </Typography>
          <WalletMultiButton />
        </Box>
      ) : (
        <>
        <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
          Presale Details
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#a0a0a0', mb: 1 }}>
            Progress ({((selectedPresale?.raised / selectedPresale?.cap) * 100).toFixed(2)}%)
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(selectedPresale?.raised / selectedPresale?.cap) * 100}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
              },
            }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>
              Raised
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {selectedPresale?.raised} SOL
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" sx={{ color: '#a0a0a0' }}>
              Cap
            </Typography>
            <Typography variant="h6" sx={{ color: 'white' }}>
              {selectedPresale?.cap} SOL
            </Typography>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          type="number"
          label="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#a0a0a0',
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => handlePresaleSubmit(selectedPresale)}
          disabled={!amount || amount < selectedPresale?.minContribution || amount > selectedPresale?.maxContribution}
          sx={{
            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
            color: '#13151a',
            '&:hover': {
              background: 'linear-gradient(90deg, #FFA500 0%, #FFD700 100%)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Contribute to Presale
        </Button>
        </>
        )}
      </PresaleModal>
    </Modal>
            </Grid>
          ))}
        </Grid>
      </Box>
  
        <Paper sx={{ p: 4, background: 'rgba(255, 255, 255, 0.05)' }}>
        <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{
          '& .MuiStepLabel-label': {
            color: '#a0a0a0',
          },
          '& .MuiStepLabel-label.Mui-active': {
            color: '#FFD700',
          },
          '& .MuiStepLabel-label.Mui-completed': {
            color: '#FFA500',
          },
          '& .MuiStepIcon-root': {
            color: 'rgba(255, 255, 255, 0.2)',
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: '#FFD700',
          },
          '& .MuiStepIcon-root.Mui-completed': {
            color: '#FFA500',
          },
        }}
      >
{steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
</Stepper>
  
          <Box mt={4} textAlign="center">
          <Button
      variant="contained"
      size="large"
      startIcon={<Rocket />}
      onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScCdG_iGw_V0iUKItxz7V8icePEu3ZfVRPkmGtcQ-20NQj_FA/viewform?usp=header', '_blank')}
      sx={{
        background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
        color: '#13151a',
        fontWeight: 'bold',
        padding: '12px 24px',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(255, 215, 0, 0.2)',
        },
        transition: 'all 0.3s ease',
      }}
    >
      Submit Your Project
    </Button>
          </Box>
        </Paper>
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
              ApeMind Launchpad
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Open-source AI launchpad for Solana
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            href="https://github.com/apeoutmeme"
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
     
        </Box>
      </Box>
    </CardContent>
  </GitHubCard>
</Grid>
        <ToastContainer
      position="top-center"
      autoClose={5000}
      limit={3}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{
        width: 'auto',
        maxWidth: '90%',
        minWidth: '300px',
      }}
    />
      </StyledContainer>
    );
  };

export default LaunchpadPage;