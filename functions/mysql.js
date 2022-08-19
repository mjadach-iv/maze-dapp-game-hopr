const mysql = require('serverless-mysql');
const escape = require('sql-template-strings')


// CREATE TABLE `maze_lobbies` (
//   `id` BIGINT NOT NULL UNIQUE AUTO_INCREMENT, 
//   `open` BOOLEAN NOT NULL DEFAULT true, 
//   `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
//   PRIMARY KEY (id)
// ) 
// ENGINE = InnoDB;

// CREATE TABLE `maze_players` (
//   `peerId` varchar(200) UNIQUE, 
//   `lobbyId` BIGINT NOT NULL DEFAULT true, 
//    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//    PRIMARY KEY (peerId),
//    FOREIGN KEY (lobbyId) REFERENCES maze_lobbies(id)
//   ) 

const db = mysql({
  config: {
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE_NAME,
    user     : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD
  }
})

const queryDB = async (query) => {
  let results = await db.query(query);
  await db.end();
  return results
}

const queryDBTransaction = async (query1, query2, query3, query4) => {
  try {
    let results;
    if (query4) {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .query(query3)
      .query(query4)
      .commit() // execute the queries
    } else if (query3) {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .query(query3)
      .commit() // execute the queries
    } else {
      results = await db.transaction()
      .query(query1)
      .query(query2)
      .commit() // execute the queries
    }
 //   let results = await db.transaction()
 //   console.log(arguments)
  //  arguments.map(query => {db.query(query)});
  //  db.commit();
    await db.end();
    return results;
  } catch (error) {
    throw error
  }
}

export async function insertIpToScoreboard (ip, country) {
    console.log('MySQL: insertIp', ip);
    await queryDB(escape`
      INSERT INTO ips (ip, country, count) VALUES (${ip},${country},1)
      ON DUPLICATE KEY UPDATE count = count + 1;
    `)
}

export async function createLobby () {
    console.log('MySQL: createLobby');
    let query = await queryDB(escape`
      INSERT INTO maze_lobbies (open) VALUE (1)
    `);
    return {insertId: query.insertId};
}

export async function createLobby2 (peerId) {
  console.log('MySQL: createLobby2');
  let results = await db.transaction()
    .query('INSERT INTO maze_lobbies (open) VALUE (1)')
    .query((r) => {
      console.log('s', peerId, r.insertId)
      return escape`INSERT INTO maze_players (peerId, lobbyId) VALUE (${peerId}, ${r.insertId})`
    })
    .commit() // execute the queries
    console.log(results)
  return {}//{insertId: query.insertId};
}

export async function getLobbies () {
  console.log('MySQL: getLobbies');
  let query = await queryDB(escape`
    SELECT * FROM maze_lobbies 
    WHERE timestamp >= (NOW() - INTERVAL 12 HOUR);
  `);
  return query;
}
