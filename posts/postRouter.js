// DB import
const db = require( "./postDb" );

// Router Setup
const router = require('express').Router();

/**************** GET ****************/

router.get( '/', ( req, res ) => 
{
  db.get()
    .then( response => res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while getting the posts" } ) );
} );

router.get( '/:id', validatePostId, ( req, res ) => 
{
  res.status( 200 ).json( { data : req.post } );
} );

/**************** DELETE ****************/

router.delete( '/:id', validatePostId, ( req, res ) => 
{
  db.remove( req.params.id )
    .then( () => res.status( 200 ).json( { data : req.post } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while deleting post..." } ) );
} );

/**************** PUT ****************/

router.put( '/:id', validatePostId, ( req, res ) => 
{
  db.update( req.params.id, { ...req.post, text : req.body.text } )
    .then( response => res.status( 200 ).json( { data : response } ) )
    .catch( () => res.status( 500 ).json( { message : "Error while updating post..." } ) );
} );

/**************** Custom Middleware ****************/

function validatePostId( req, res, next ) 
{
  db.getById( req.params.id )
    .then( response =>
      {
        req.post = response;
        next();
      } )
    .catch( () => res.status( 400 ).json( { message : "invalid post id" } ) );
}

module.exports = router;