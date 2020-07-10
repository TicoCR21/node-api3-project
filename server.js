const express = require( 'express' );

const server = express();

server.use( express.json() );
server.use( logger );

server.get( '/', ( req, res ) => 
{
  res.send( `<h2>Let's write some middleware!</h2>` );
} );

//custom middleware
function logger( req, res, next ) 
{
  console.log( `Request Information\n - Request Method : ${ req.method }\n - Request URL : ${ req.url }\n - Timestamp : ${ new Date().toUTCString() }\n`);
  next();
}

module.exports = server;