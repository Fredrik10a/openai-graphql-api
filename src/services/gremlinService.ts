import gremlin from 'gremlin';
import dotenv from 'dotenv';

dotenv.config();

const { driver } = gremlin;
const { Client, auth } = driver;

// Ensure environment variables are set
if ( !process.env.COSMOS_DB_KEY ) {
  throw new Error( 'COSMOS_DB_KEY is not defined' );
}
if ( !process.env.COSMOS_DB_GREMLIN_ENDPOINT ) {
  throw new Error( 'COSMOS_DB_GREMLIN_ENDPOINT is not defined' );
}

// Create a connection to Cosmos DB Gremlin API
const resourceLink = `/dbs/${process.env.COSMOS_DB_DATABASE}/colls/${process.env.COSMOS_DB_COLLECTION}`;
const authenticator = new auth.PlainTextSaslAuthenticator( resourceLink, process.env.COSMOS_DB_KEY );

const _client = new Client( process.env.COSMOS_DB_GREMLIN_ENDPOINT, {
    authenticator,
    traversalsource: 'g',
    rejectUnauthorized: true,
    mimeType: 'application/vnd.gremlin-v2.0+json',
    keepAlive: true,
} );

/**
 * Just for test.
 */
export const testConnection = () => async () => { 
    try {
    console.log( `Testing Gremlin connection...` );
    
    const result = await _client.submit( `g.V().limit(1)` );
    
    console.log( 'Test Result:', result );
    return result;
  } catch ( err ) {
    console.error( 'Error executing Gremlin query:', err );
    throw err;
  }
}

/**
 * Executes a Gremlin query on Cosmos DB.
 */
export const executeGremlinQuery = async ( gremlinQueryString: string ) => {
    try {
        await testConnection();
        console.log( `Executing Gremlin Query...` );
    
        // Submit the query
        const result = await _client.submit( gremlinQueryString );
    
        console.log( 'Query Result:', result );
        return result;
    } catch ( err ) {
        console.error( 'Error executing Gremlin query:', err );
        throw err;
    }
};

/**
 * Gracefully closes the connection when needed.
 */
export const closeConnection = () => {
  console.log( 'Closing Gremlin connection...' );
  _client.close();
};
