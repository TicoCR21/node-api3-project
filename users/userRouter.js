// DB imports
const DB_USER = require( "./userDb" );
const DB_POSTS = require( "../posts/postDb" );

// Router Setup
const router = require( 'express' ).Router();


/**************** POST ****************/

router.post( '/', validateUser, ( req, res ) => 
{
  DB_USER.insert( req.body )
    .then( response => res.status( 201 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while adding new user..." } ) )
} );

router.post( '/:id/posts', validateUserId, validatePost, ( req, res ) => 
{
  DB_POSTS.insert( { ...req.body, user_id : req.user.id } )
    .then( response => res.status( 201 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while posting new post..." } ) );   
} );

/**************** GET ****************/

router.get( '/', ( req, res ) => 
{
  DB_USER.get()
    .then( response => res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while getting users..." } ) );
} );

router.get( '/:id', validateUserId, ( req, res ) => 
{
  res.status( 200 ).json( { data : req.user } )
} );

router.get( '/:id/posts', validateUserId, ( req, res ) => 
{
  DB_USER.getUserPosts( req.params.id )
    .then( response => res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while getting users..." } ) );
} );

/**************** DELETE ****************/

router.delete( '/:id', validateUserId, ( req, res ) => 
{
  DB_USER.remove( req.params.id )
    .then( () => res.status( 200 ).json( { data : req.user } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while deleting user..." } ) );
} );

/**************** PUT ****************/

router.put( '/:id', validateUserId, validateUser, ( req, res ) => 
{
  DB_USER.update( req.params.id, req.body )
    .then( response => response === 1 ? res.status( 200 ).json( { data : { ...req.body, id : req.params.id } } ) : res.status( 400 ).json( { message : "Error" } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while updating user..." } ) );
} );

/**************** Custom Middleware ****************/

function validateUserId( req, res, next ) 
{
  DB_USER.getById( req.params.id )
    .then( response =>
      {
        req.user = response;
        next();
      } )
    .catch( () => res.status( 400 ).json( { message : "invalid user id" } ) );
}

function validateUser( req, res, next ) 
{
  if( !req.body )
    return res.status( 400 ).json( { message : "missing user data" } );

  if( !req.body.name )
    return res.status( 400 ).json( { message : "missing required name field" } );
  
  next();
}

function validatePost( req, res, next ) 
{
  if( !req.body )
    return res.status( 400 ).json( { message : "missing post data" } );
  
  if( !req.body.text )
    return res.status( 400 ).json( { message : "missing required text field" } );

  next();
}

module.exports = router;