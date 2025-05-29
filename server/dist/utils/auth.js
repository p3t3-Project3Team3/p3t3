import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();
export const authenticateToken = async ({ req, }) => {
    let token = req.body.token || req.query.token || req.headers.authorization || '';
    let user = null;
    if (!token) {
        return { user: null };
    }
    if (token) {
        try {
            token = token.split(' ').pop()?.trim() || '';
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || '', {
                maxAge: '4h',
            });
            user = decoded.data; // this should match your payload
        }
        catch (err) {
            console.log('Invalid token');
        }
    }
    return { user };
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};
export class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}
;
