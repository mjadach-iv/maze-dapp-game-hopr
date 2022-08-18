import React, { useEffect, useState } from "react";
import useWebsocket from "./useWebSocket";
import { decode } from 'rlp'

export const WebSocketHandler= ({ wsEndpoint, securityToken }) => {
  const [message, setMessage] = useState("");
  const websocket = useWebsocket({ wsEndpoint, securityToken });
  const { socketRef } = websocket;

  const decodeMessage =  (msg) => {
    let uint8Array = new Uint8Array(JSON.parse(`[${msg}]`));    
    let decodedArray = decode(uint8Array)
    if (decodedArray[0] instanceof Uint8Array) {
      return new TextDecoder().decode(decodedArray[0])
    }
    throw Error(`Could not decode received message: ${msg}`)
  }

  const handleReceivedMessage = async (ev) => {
    try {
      const data = decodeMessage(ev.data)
      console.log("WebSocket Data: ", data);
      setMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.addEventListener("message", handleReceivedMessage);

    return () => {
      if (!socketRef.current) return;
      socketRef.current.removeEventListener("message", handleReceivedMessage);
    };
  }, [socketRef.current]);

  return <span>{message ? message : "You have no messages."}</span>;
};

export default WebSocketHandler;