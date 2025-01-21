import { Paper, Stack, InputBase, Typography, IconButton, Box } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import PerfectScrollbar from 'react-perfect-scrollbar';
import StyledButtonComponent from './UserButton';
import http from '../../../api/http';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { WebSocket } from '../../../main';
import { useAuth } from '../../../modules/context/AuthContext';
import AuthorBox from './chatBubbles/authorBox';
import ClientBox from './chatBubbles/clientBox';
import ReactTimeAgo from 'react-time-ago';

const ChatBoxContainer = () => {
  const [userDetails, setUserDetails] = useState([])
  const [selectedRoom, setSelectedRoom] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const AppSocket = WebSocket();
  const {accessToken} = useAuth();
  const messageEl = useRef(null);

  const formatDateTime = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const joinRoom = (room) => {
    if (room !== "") {
      AppSocket.emit("join_room", room);
    }
  };

  const ReadMessage = async (room) => {
    try {
      await http.post('/unread-guest-messages' , {room})
      getUserDetails();
    } catch (error) {
      console.error(error)
    }
  }

  const getUserDetails = async () => {
    try {
        const response = await http.get('/get-guest-users');
        const data = response.data;
        data.forEach((variable) => {
          variable.roomSplit = variable.room.split("-")[0] + "-" + variable.room.split("-")[1];
          variable.messageLength = variable.message.length >= 17 ? variable.message.substring(0, 17) + "..." : variable.message;
        });
        setUserDetails(data)
    } catch(error) {
        console.error(error)
    }
  }

  const handleButtonClick = (room) => {
    setSelectedRoom(room);
    joinRoom(room);
    ReadMessage(room);
  };

  useEffect(() => { 
    getUserDetails();
    AppSocket.on('openGuestTicket', () => {
      getUserDetails();
    })
    return () => {
      AppSocket.off('openGuestTicket');
    };
  }, [AppSocket])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: selectedRoom,
        author: accessToken.fName,
        message: currentMessage,
        time:formatDateTime(new Date()),
      };

      await AppSocket.emit("send_message", messageData);
      await AppSocket.emit("triggerGuestNotification");
      await AppSocket.emit("triggerNotifyGuest");
      getUserDetails();
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    AppSocket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    AppSocket.on("load_messages", (messages) => {
      setMessageList(messages);
    });
  }, [AppSocket]);

  useEffect(() => {
    if (messageEl.current) {
      const observer = new MutationObserver(() => {
        messageEl.current.scroll({ top: messageEl.current.scrollHeight, behavior: 'smooth' });
      });

      observer.observe(messageEl.current, { childList: true });

      return () => {
        observer.disconnect();
      };
    }
  }, []);
  return (
    <Paper sx={{
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        display: 'flex',
        flexDirection: 'row',
        height: '68vh'
    }}>
        <Stack sx={{
            display: {
                xs: 'none',
                sm: 'flex'
            },
            flexDirection: 'column',
            height: '100%',
            flexShrink: 0,
            width: '350px',
            borderRight: '1px solid rgba(145, 158, 171, 0.2)'
        }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px 20px 0px', 
                mb:3
            }}>
                <Typography variant="h4">Administrator</Typography>
            </Stack>
            <Stack sx={{
                flexGrow: 1,
                height: '100%',
                overflow: 'hidden'
            }}>
                 <PerfectScrollbar>
                <>
                {userDetails.length === 0 ?
                    ''
                    :
                    userDetails.map((variable, index) => (
                    <div key={index} >
                        <StyledButtonComponent 
                        UserName={variable.roomSplit} 
                        chatdesc={variable.author === accessToken.fName ? <Typography sx={{fontSize: '0.775rem', color: 'rgb(145, 158, 171)' }}>You: {variable.messageLength}</Typography>: <Typography sx={{fontSize: '0.775rem', color: variable.unread === 0 ? 'rgb(145, 158, 171)' : 'white' }}>{variable.messageLength}</Typography> } 
                        onClick={() => handleButtonClick(variable.room)}
                        timeAgo={<ReactTimeAgo date={new Date(variable.time).getTime()} /> }
                        badgeValue={variable.author === accessToken.fName ? 0 : variable.unread_count}
                        />
                    </div>
                    ))
                }
                </>
                </PerfectScrollbar>
            </Stack>
        </Stack>
        <Stack sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexShrink: 0,
                padding: '8px 8px 8px 20px',
                minHeight: '72px'
            }}>

            </Stack>
            <Stack sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderTop: '1px solid rgba(145, 158, 171, 0.2)',
            }}>
                <Stack sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    <Stack sx={{
                        flexGrow: 1,
                        height: '100%',
                        overflow: 'hidden'
                    }}>
                        <Box ref={messageEl} sx={{
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                        {messageList.map((messageContent, index) => (
                            <div key={index} >
                                {selectedRoom === messageContent.author ? (
                                <Box sx={{ml:2, mt:2}}>
                                    <ClientBox
                                    message={messageContent.message}
                                    time={<ReactTimeAgo date={new Date(messageContent.time).getTime()} /> }
                                    />
                                </Box>
                                ) : (                    
                                <Box sx={{mr:2}}>
                                    <AuthorBox
                                    authorMessage={messageContent.message}
                                    authorTime={<ReactTimeAgo date={new Date(messageContent.time).getTime()} />}
                                    />
                                </Box>
                                )}
                            </div>
                            ))
                        }
                        </Box>
                    </Stack>
                    <InputBase placeholder="Type a message" 
                    value={currentMessage}
                    onChange={(event) => {
                      setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                      event.key === "Enter" && sendMessage();
                    }}
                    startAdornment={
                        <ChatIcon fontSize='small' sx={{ mr: 1 }} />
                    }
                    endAdornment={
                        <Stack sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexShrink: 0
                        }}>
                            <IconButton onClick={sendMessage}>
                            <SendIcon fontSize='small' sx={{ mr: 1}}/>
                            </IconButton>         
                        </Stack>
                    }
                    sx={{
                        lineHeight: '1.4375em',
                        boxSizing: 'border-box',
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        height: '56px',
                        flexShrink: 0,
                        borderTop: '1px solid rgba(145, 158, 171, 0.2)',
                        fontSize: '0.90rem'
                    }} 
                    />
                </Stack>
            </Stack>
        </Stack>
    </Paper>
  )
}

export default ChatBoxContainer