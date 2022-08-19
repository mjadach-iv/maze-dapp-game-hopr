// Next.js API route support: https://nextjs.org/docs/api-routes/introduction,



import { createLobby, createLobby2 } from '../../functions/mysql';

export default async function handler(req, res) {
  console.log('API: Create Lobby: ', )
  const peerId = JSON.parse(req.body).peerId;
  const mysql =  await createLobby(peerId);
  res.status(200).json(mysql)
}
