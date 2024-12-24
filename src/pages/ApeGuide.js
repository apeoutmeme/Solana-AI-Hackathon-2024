/**
 * ApeGuide Component
 * 
 * Implementation Requirements:
 * 1. Environment Variables:
 *    - REACT_APP_RPM_SUBDOMAIN: Ready Player Me subdomain
 * 
 * 2. Required Components:
 *    - TokenMarketData: Component for displaying market data
 *    - StreamIntegration: Component for handling live streaming
 * 
 * 3. Required Assets:
 *    - Default avatar GLB file
 * 
 * 4. Features:
 *    - Avatar creation and customization
 *    - Text-to-speech integration
 *    - Market data analysis
 *    - Live streaming capabilities
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, IconButton, Tooltip, Grid, Card, CardContent, Button } from '@mui/material';
import { SmartToy, VolumeUp, VolumeOff, Update, ShowChart, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { YouTube } from '@mui/icons-material';
import { List, ListItem } from '@mui/material';

// Styled components remain the same...

const ApeGuide = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const frameRef = useRef(null);
  const [isStreamingMode, setIsStreamingMode] = useState(false);

  // Replace with your configuration
  const subdomain = process.env.REACT_APP_RPM_SUBDOMAIN || 'demo';

  // Ready Player Me integration
  useEffect(() => {
    const subscribe = (event) => {
      const json = parseMessage(event);
      if (json?.source !== 'readyplayerme') {
        return;
      }

      if (json.eventName === 'v1.frame.ready') {
        frameRef.current?.contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }

      if (json.eventName === 'v1.avatar.exported') {
        setAvatarUrl(json.data.url);
        setShowAvatarCreator(false);
        setIsLoading(false);
      }    };

    window.addEventListener('message', subscribe);
    return () => window.removeEventListener('message', subscribe);
  }, []);

  const mockMarketData = {
    token1: { price: 100, change: 2.5 },
    token2: { price: 50, change: -1.2 },
    token3: { price: 0.001, change: 5.7 }
  };

  const handleCreateAvatar = () => {
    setShowAvatarCreator(true);
    setIsLoading(true);
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const mockData = {
            btc: { price: 65000, change: 2.5 },
            sol: { price: 125, change: 5.2 },
            bnna: { price: 0.00001, change: 10.5 }
          };
          setMarketData(mockData);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const speak = (text) => {
    if (isMuted) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
<Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3 }}>Create Your Own AI Agent Avatar</Typography>
          <AvatarFrame>
            {showAvatarCreator ? (
                <>
              <iframe
                ref={frameRef}
                src={`https://${subdomain}.readyplayer.me/avatar?frameApi`}
                allow="camera *; microphone *"
                title="Ready Player Me"
              />
              <model-viewer
                src={avatarURL}
                auto-rotate
                camera-controls
                style={{ width: '100%', height: '100%' }}
              />
              
              <Tooltip title={isStreamingMode ? "Stop Streaming" : "Start Streaming"}>
            
            </Tooltip>
            
            {isStreamingMode && (
              <StreamIntegration 
                onSpeak={speak}
                isMuted={isMuted}
                avatarUrl={avatarUrl}
              />
            )}
            </>
            ) : avatarURL ? (
                <>
              <model-viewer
                src={avatarURL}
                auto-rotate
                camera-controls
                style={{ width: '100%', height: '100%' }}
              />
              <IconButton 
              onClick={() => setIsStreamingMode(!isStreamingMode)}
              sx={{ 
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
            >
              <YouTube />
            </IconButton>
           
            </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <SmartToy sx={{ fontSize: 80, color: '#fbbf24' }} />
                <Button
                  variant="contained"
                  onClick={handleCreateAvatar}
                  startIcon={<Edit />}
                  sx={{
                    background: 'linear-gradient(to right, #fbbf24, #d97706)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #d97706, #b45309)',
                    }
                  }}
                >
                  Create Your Avatar
                </Button>
              </Box>
            )}
            
            <ControlsContainer>
              <Tooltip title={isMuted ? "Unmute" : "Mute"}>
                <IconButton 
                  onClick={() => setIsMuted(!isMuted)}
                  sx={{ color: '#fbbf24' }}
                >
                  {isMuted ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh Analysis">
                <IconButton 
                  onClick={() => setIsAnalyzing(true)}
                  sx={{ color: '#fbbf24' }}
                >
                  <Update />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Charts">
                <IconButton sx={{ color: '#fbbf24' }}>
                  <ShowChart />
                </IconButton>
              </Tooltip>

              {avatarUrl && (
                <Tooltip title="Edit Avatar">
                  <IconButton 
                    onClick={handleCreateAvatar}
                    sx={{ color: '#fbbf24' }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
            </ControlsContainer>
          </AvatarFrame>
          
         
          <Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 'bold', mb: 3, mt: 3 }}>Go Live with your AI Agent</Typography>
          <List>
                <ListItem>
                <Typography variant="h6" sx={{ color: '#666' }}>Deploy Tokens</Typography>
                </ListItem>
                <ListItem>
                <Typography variant="h6" sx={{ color: '#666' }}>Create AI Agent Wallet</Typography>
                </ListItem>
                <ListItem>
                <Typography variant="h6" sx={{ color: '#666' }}>Go Live</Typography>
                </ListItem>
          </List>
        
          <LiveStreamCard>
  <CardContent>
    <LiveIndicator>NOT LIVE</LiveIndicator>
    <Box sx={{ 
      height: 300, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: 1,
      mb: 2
    }}>
      {/* Replace this Typography with your GIF/Animation component */}
      <Typography sx={{ color: '#666' }}>
        Live Stream Preview
      </Typography>
    </Box>
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }}>
      <Box>
        <Typography variant="h6" sx={{ color: '#fbbf24' }}>
          Live AI Stream
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          0 watching now
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<YouTube />}
        sx={{
          background: '#ff0000',
          '&:hover': {
            background: '#d70000',
          }
        }}
      >
        Go Live
      </Button>
    </Box>
  </CardContent>
</LiveStreamCard>
        </Grid>
        {isStreamingMode && (
              <StreamIntegration 
                onSpeak={speak}
                isMuted={isMuted}
                avatarUrl={avatarUrl}
              />
            )}

        <Grid item xs={12} md={6}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#fbbf24',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Market Analysis
          </Typography>

          <Grid container spacing={2}>
            {marketData && Object.entries(marketData).map(([token, data]) => (
              <Grid item xs={12} key={token}>
               
              </Grid>
            ))}
          </Grid>

          <Box sx={{
            mt: 4,
            p: 3,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 2,
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <Typography sx={{ 
              color: 'white',
              fontStyle: 'italic'
            }}>
              {currentMessage || "Analyzing market conditions..."}
            </Typography>
          </Box>
          <TokenMarketData />
        </Grid>
      </Grid>
    </Container>  );
};

export default ApeGuide;