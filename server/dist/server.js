import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import cors from 'cors';
import bodyParser from 'body-parser';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
        console.error('GraphQL Error:', err);
        return err;
    }
});

const startApolloServer = async () => {
    await server.start();
    await db();
    
    const PORT = process.env.PORT || 3001;
    const app = express();
    
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    
    app.use('/graphql', expressMiddleware(server, {
        context: authenticateToken, // ✅ Token context passed here
    }));
    
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 API server running on port ${PORT}`);
        console.log(`🔗 GraphQL available at http://localhost:${PORT}/graphql`);  
    });
};

startApolloServer();
