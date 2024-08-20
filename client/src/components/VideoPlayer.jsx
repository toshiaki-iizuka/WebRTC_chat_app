import React, { useContext } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '../SocketContext';

const Video = styled('video')(({ theme }) => ({
  width: '550px',
  [theme.breakpoints.down('xs')]: {
    width: '300px',
  },
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
}));

const StyledPaper = styled(Paper)({
  padding: '10px',
  border: '2px solid black',
  margin: '10px',
});

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, call } = useContext(SocketContext);

  return (
    <GridContainer container>
      <StyledPaper>
        <Grid item xs={12} md={6}>
          <Typography variant='h5' gutterBottom>
            {name || 'Name'}
          </Typography>
          <Video playsInline muted ref={myVideo} autoPlay />
        </Grid>
      </StyledPaper>
      {callAccepted && !callEnded && (
        <StyledPaper>
          <Grid item xs={12} md={6}>
            <Typography variant='h5' gutterBottom>
              {call.name || 'Name'}
            </Typography>
            <Video playsInline ref={userVideo} autoPlay />
          </Grid>
        </StyledPaper>
      )}
    </GridContainer>
  );
};

export default VideoPlayer;
