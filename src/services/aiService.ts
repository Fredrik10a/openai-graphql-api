import OpenAI from "openai";
import dotenv from "dotenv";
import { executeGremlinQuery } from "./gremlinService.js";

dotenv.config();

const openai = new OpenAI( {
    apiKey: process.env.OPENAI_API_KEY,
} );

export const generateGremlinQuery = async ( graphqlQuery: string ) => {
    const prompt = `
    Convert this GraphQL query into an optimized Gremlin query:

     GraphQL Query:
     ${graphqlQuery}

     Output only the Gremlin query. 
     Please ensure the following:
     - Do NOT add gremling or gremlin any other extraneous words before the query.
     - The query should be properly formatted and syntactically correct.
     - The query shall start with only g as this example g.addV('Book') for examnple.
     - Ensure proper Gremlin syntax for adding vertices and their properties.
     - Always include the partition key property (e.g., 'site') with a valid, non-null value when adding a vertex.
    `;

    const response = await openai.chat.completions.create( {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    } );

    // Get the generated Gremlin query
    let gremlinQueryString = response.choices[0]?.message?.content || "";
    
    // Clean the Gremlin query string
    gremlinQueryString = gremlinQueryString
        .trim()                      // Remove leading/trailing whitespace
        .replace( /`/g, "" )           // Remove any backticks
        .replace( /\n+/g, " " )        // Replace multiple newlines with a single space
        .replace( /\s+/g, " " );       // Replace multiple spaces with a single space
    console.log( "Cleaned Gremlin Query:", gremlinQueryString );
    gremlinQueryString = gremlinQueryString.replace( /gremlin|gremling/gi, "" );
    return executeGremlinQuery( gremlinQueryString );
};
