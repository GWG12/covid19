import { getDb } from '../util/database.js';


export class User {

    constructor({ email, password } = {}) {
        this.email = email;
        this.password = password;
    }

    async save() {
        const db = getDb();
        try {
            const result = await db.collection('users').insertOne(this);
            return result;
        } catch (err) {
            return;
        }
    }

    static async findByEmail(email) {
        const db = getDb();
        try {
            const result = await db.collection('users')
                .findOne(
                    { email: email });
            return result
        } catch (err) {
            return;
        }
    }

    static async findById(userId) {
        const db = getDb();
        try {
            const result = await db.collection('users')
                .findOne(
                    { _id: userId });
            return result
        } catch (err) {
            return;
        }
    }
}