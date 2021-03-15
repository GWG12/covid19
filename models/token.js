import { getDb } from '../util/database.js';


export class Token {

    constructor({ userId, refreshToken } = {}) {
        this.userId = userId;
        this.refreshToken = refreshToken;
    }

    async save() {
        const db = getDb();
        try {
            const result = await db.collection('tokens').insertOne(this);
            return result;
        } catch (err) {
            console.log('error');
        }
    }

    static async getRefreshToken(userId, jti) {
        const db = getDb();
        try {
            const result = await db.collection('tokens')
                .findOne({ userId: userId, refreshToken: jti }, { _id: 0, refreshToken: 1 });
            return result;
        } catch (err) {
            console.log('error');
        }
    }

    static async replaceRefreshToken(userId, newToken) {
        const db = getDb();
        try {
            const result = await db.collection('tokens')
                .updateOne({ userId: userId },
                    {
                        $set: {
                            refreshToken: newToken
                        }
                    });
            return result;
        } catch (err) {
            console.log('error')
        }
    }

    static async revokeRefreshToken(userId) {
        const db = getDb();
        try {
            const result = await db.collection('tokens')
                .updateOne({ userId: userId },
                    {
                        $set: {
                            refreshToken: null
                        }
                    });
            return result;
        } catch (err) {
            console.log('error')
        }
    }



}