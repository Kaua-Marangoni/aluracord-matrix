import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import ClockLoader from "react-spinners/ClockLoader";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4ODg0NywiZXhwIjoxOTU4ODY0ODQ3fQ.BO0D6is1lMBl-N78h0aNzTHm6vaVKAoP1Jz66Ll1HMI"
const SUPABASE_URL = "https://afrsnjmuatymzfmwgnak.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function ChatPage() {
  const [message, setMessage] = useState();
  const [listOfMessages, setListOfMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      await supabaseClient
        .from("messages")
        .select("*")
        .order("id", { ascending: false })
        .then(({ data }) => {
          setListOfMessages(data)
        })
    }

    fetchMessages()
    setLoading(false)
  }, []);

  async function handleNewMessage(newMessage) {
    if (newMessage !== "") {
      setLoading(true)
      const message = {
        // id: listOfMessages.length + 1,
        from: await sessionStorage.getItem("username:aluracord"),
        textMessage: newMessage,
      }

      await supabaseClient
        .from("messages")
        .insert([
          message
        ])
        .then(({ data }) => {
          setListOfMessages([data[0], ...listOfMessages])
        })

      setLoading(false)
      setMessage("")
    } else {
      alert("Escreve ai tio")
    }
  }

  async function deleteMessage(messageId) {
    setLoading(true)
    await supabaseClient.from("messages")
      .delete()
      .match({ id: messageId })
      .then(() => {
        const ActualMessages = listOfMessages.filter(messages => messages.id !== messageId)
        setListOfMessages(ActualMessages)
      })
    setLoading(false)
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >

        <Header />

        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          {loading && <SpinnerLoading />}

          <MessageList messages={listOfMessages} deleteMessage={deleteMessage} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={message}
              onChange={(event) => {
                const value = event.target.value
                setMessage(value)
              }}

              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()

                  handleNewMessage(message)
                }
              }}

              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function SpinnerLoading() {
  return (
    <>
      <Box styleSheet={{
        width: '100%',
        height: "100%",
        marginLeft: '-16px',
        marginTop: '-16px',
        position: 'absolute',
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
      }} >
        <ClockLoader color={"#ffffff"} size={50} />
      </Box>
    </>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >

      {props.messages.map((message) => {
        return (
          <Text
            key={message.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >

              <Box styleSheet={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Image
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${message.from}.png`}
                />
                <Text tag="strong">
                  {message.from}
                </Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {(new Date().toLocaleDateString("pt-BR"))}
                </Text>
              </Box>

              <Text styleSheet={{
                fontSize: '10px',
                float: 'right',
                marginLeft: '8px',
                cursor: 'pointer',
                color: appConfig.theme.colors.neutrals[300],
              }}
                onClick={() => props.deleteMessage(message.id)}
              >
                Deletar
              </Text>
            </Box>
            {message.textMessage}
          </Text>
        )
      })}

    </Box>
  )
}