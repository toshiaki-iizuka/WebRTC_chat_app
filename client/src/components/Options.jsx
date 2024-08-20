import React, { useContext, useState } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@mui/material';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SocketContext } from '../SocketContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  width: '600px',
  margin: '35px 0',
  padding: 0,
  [theme.breakpoints.down('xs')]: {
    width: '80%',
  },
}));

const StyledPaper = styled(Paper)(() => ({
  padding: '10px 20px',
  border: '2px solid black',
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  noValidate: 'off',
});

const GridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
  },
}));

const PaddingGridItem = styled(Grid)(() => ({
  padding: 20,
}));

const MarginButton = styled(Button)(() => ({
  marginTop: 20,
}));

const Options = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <StyledContainer>
      <StyledPaper elevation={10}>
        <Form noValidate autoComplete='off'>
          <GridContainer container>
            <PaddingGridItem item xs={12} md={6}>
              <Typography gutterBottom variant='h6'>
                Account Info
              </Typography>
              <TextField
                label='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <CopyToClipboard text={me}>
                <MarginButton
                  variant='contained'
                  color='primary'
                  fullWidth
                  startIcon={<Assignment fontSize='large' />}
                >
                  Copy Your ID
                </MarginButton>
              </CopyToClipboard>
            </PaddingGridItem>
            <PaddingGridItem item xs={12} md={6}>
              <Typography gutterBottom variant='h6'>
                Make a call
              </Typography>
              <TextField
                label='ID to call'
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {callAccepted && !callEnded ? (
                <MarginButton
                  variant='contained'
                  color='secondary'
                  startIcon={<PhoneDisabled fontSize='large' />}
                  fullWidth
                  onClick={leaveCall}
                >
                  Hang Up
                </MarginButton>
              ) : (
                <MarginButton
                  variant='contained'
                  color='primary'
                  startIcon={<Phone fontSize='large' />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </MarginButton>
              )}
            </PaddingGridItem>
          </GridContainer>
        </Form>
        {children}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Options;
