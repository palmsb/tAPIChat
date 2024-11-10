import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';


const API_KEY ="cola aqui a key"

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message:'Olá, esse é o QualyChat!',
      sender: 'Chat Gpt',
      direction:'incoming'
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }

    const newMessages = [...messages, newMessage] ; //todo o historico + as novas msgs

    setMessages(newMessages)

    setTyping(true);

    await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages){

    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant'
      } else {
        role = 'user'
      }

      return {role: role, content: messageObject.message}
    })

    //definindo como o chat deve falar, acho que se chama temperatura
    const systemMessage = {
      role: 'system',
      content: 'Explain all concepts like you really want to help your costumer and make them happy'
    }

    const apiRequestBody = {
      "model": "COLOCAR AQUI A VERSAO DO CHAT GPT, exemplo: gtp-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers:{
        'Authorization' : `Bearer ${API_KEY}`,
        'Content-Type' : "application/json"
      },
      body: JSON.stringify(apiRequestBody) 
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data.choiches[0].message.content);
      setMessages(
        [...chatMessages,{
          message: data.choiches[0].message.content,
          sender: 'ChatGPT'
        }]
      ) 
      setTyping(false); 
    })

  }

    return (
    <>
      <div className='App'>
        <div style={{
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        height: '500px', 
        width: '400px', 
        border: '4px solid #ccc', 
        borderRadius: '8px', 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
              scrollBehavior='smooth'
                typingIndicator={typing? <TypingIndicator content="QualyChat está digitando..."/> : null}
              >
                {messages.map((message, i) => {
                  return <Message key ={i} model={message}/>
                })}
              </MessageList>

              <MessageInput placeholder='Escreva sua mensagem aqui!' onSend = {handleSend}/>
            </ChatContainer>
          </MainContainer>

        </div>
      </div>
    </>
  )
}

export default App
 