import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);

      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
    });

    socketRef.current.on('me', (id) => setMe(id));

    socketRef.current.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      socketRef.current.off('me');
      socketRef.current.off('callUser');
      socketRef.current.disconnect();
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log('Calling user with ID:', id); // デバッグ用

    if (!stream) {
      console.error('Stream is null or undefined.'); // デバッグ用
      return;
    }

    let peer;
    try {
      peer = new Peer({ initiator: true, trickle: false, stream });
    } catch (error) {
      console.error('Error initializing Peer:', error); // デバッグ用
      return;
    }

    peer.on('signal', (data) => {
      console.log('Emitting callUser event with data:', data); // デバッグ用
      socketRef.current.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socketRef.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      console.log('Call accepted with signal:', signal); // デバッグ用
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
