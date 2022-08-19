import React, { useState, useEffect, useRef } from 'react';
//import './index.css';

import styled from '@emotion/styled'
import Button from '@mui/material/Button';

import ReactLogo2 from '../hopr-logo/hopr-icon.svg';

import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { getPeerId } from '../../functions/hopr-sdk';




const LobbyOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: calc( 100vw - 128px );
  height: calc( 100vh - 128px );
  padding: 64px;
`

const LobbyContainer = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(250 250 250 / 95%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`


const Title = styled.div`
  color: ccc;
  font-size: 32px;
  font-family: Source Code Pro,monospace;
  text-align: center;
`

const HoprTextField = styled(TextField)`
  width: 100%;
`


const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const HoprButton = styled(Button)`
  margin-top: 32px;
  color: #ccc;
  border-radius: 100px;
  cursor: pointer;
  font-weight: 700;
  padding: 0.3em 1.5em;
  background: linear-gradient(#000050,#0000b4);
  border: 1px solid #ffffff;
  text-transform: none;
  font-family: Source Code Pro,monospace;
  font-size: 28px;
  &:hover {
    /* border: 1px solid #ffffff61; */
  }
`




function App(props) {
  const [networkWorking, set_networkWorking] = useState(false);
  const [lobbyId, set_lobbyId] = useState(null);
  const [lobbies, set_lobbies] = useState([]);
  const [peerId, set_peerId] = useState(null);
  const [enviorement, set_enviorement] = useState(null);

  useEffect(() => {
    getLobbies();
    const interval = setInterval(() => {
      getLobbies();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  function testNetwork(){
    console.log('Test')
    if(props.apiEndpoint && props.apiToken){
      const host = new URL(props.apiEndpoint).host;
      set_enviorement(host.split('.')[0].match(/_\w+/)[0].replace('_','') || 'any' );
      const fetchData = async () => {
        const id = await getPeerId(props.apiEndpoint, props.apiToken);
        if(id) {
          set_networkWorking(true);
          set_peerId(id);
        }
        else set_networkWorking(false)
      }
      fetchData().catch(console.error);
    }
  };

  async function createLobby(){
    let url = `/api/create-lobby`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        peerId,
        enviorement
      })
    }
    );
    const json =  await response.json();
    console.log('response', json);
    set_lobbyId(json.insertId);
  };

  async function getLobbies() {
    let url = `/api/get-lobbies`;
    const response = await fetch(url);
    const json =  await response.json();
    set_lobbies(json);
  };
  
  return (
    <LobbyOverlay>
      <LobbyContainer>
        <ReactLogo2
          className="win-overlay--logo"
        />
        <Title> 
          HOPR Node Settings
        </Title>
        <HoprTextField
          label="apiEndpoint"
          id="filled-size-small"
          defaultValue="Small"
          variant="filled"
          size="small"
          value={props.apiEndpoint}
        />
        <HoprTextField
          label="apiToken"
          id="filled-size-small"
          defaultValue="Small"
          variant="filled"
          size="small"
          value={props.apiToken}
        />
        <Row>
          <Button 
            variant="outlined"
            onClick={testNetwork}
          >Test</Button>
          {
            networkWorking ? 
              <DoneIcon/>
              :
              <DoNotDisturbIcon/>
          }
          

        </Row>

        <Row>
          <Title> 
            Lobby
          </Title>
          <Button 
              variant="outlined"
              disabled={!networkWorking || lobbyId}
              onClick={createLobby}
          >
            Create lobby
          </Button>
        </Row>
        <p>
          <strong>In lobby ID: </strong>{lobbyId}
        </p>
        <p>
          <strong>Lobbies online:</strong>
        </p>
        {JSON.stringify(lobbies)}
        {enviorement}
        

      </LobbyContainer>
    </LobbyOverlay>
  );
}

export default App;
