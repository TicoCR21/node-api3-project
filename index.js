const server = require( "./server" );

server.use( "/api/users", require( "./users/userRouter" ) );
server.use( "/api/posts", require( "./posts/postRouter" ) );

const PORT_NUMBER = 5000;
server.listen( PORT_NUMBER, () => { console.log( `\n* Server Running on http://localhost:${ PORT_NUMBER } *\n` ) } );