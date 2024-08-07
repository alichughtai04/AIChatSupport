'use client'
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '@/app/firebase/config';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Box, Stack, TextField, Button } from '@mui/material';

export default function Home() {
  ///auth
  const [user] = useAuthState(auth);
  const [userSession, setUserSession] = useState(null);
  const router = useRouter();
  ///auth
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the Headstarter support assistant. How can I help you today?" }
  ]);

  ///auth
  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, userSession, router]);

  const sendMessage = async () => {
    // Add the user message to the messages array
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);

    // Send the message to the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userPrompt: message }),
    });

    // Process the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    // Read the response stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      // Update the last assistant message in the state with the current result
      setMessages([...newMessages, { role: 'assistant', content: result }]);
    }

    setMessage(''); // Clear the input field
  };

  const [message, setMessage] = useState('');

  return (
    <><Button
      variant="contained"
      width="20vw"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 2
      }}
      onClick={() => {
        signOut(auth);
        sessionStorage.removeItem('user');
      } }
    >
      Log Out
    </Button><Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{marginBottom: 6,
        fontSize: '2rem', 
        fontWeight: 'bold',
        borderBottom: '4px solid white', 
        borderRadius: '5px' }} >Chat Support</Box>
        <Stack direction={'column'} width="600px" height="650px" border="1px solid white" p={2}>
          <Stack direction={'column'} spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
            {messages.map((msg, index) => (
              <Box key={index} display="flex" justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'} color="white" borderRadius={13} p={2} margin={1.5}>
                  {msg.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={'row'} spacing={2} marginTop={2}>
            <TextField label="Message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} sx={{ backgroundColor: 'white' }} />
            <Button variant="contained" onClick={sendMessage}>Send</Button>
          </Stack>
        </Stack>
      </Box></>
  );
}
