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
            console.log('error');
        }
    }

    static findByEmail(email) {
        const db = getDb();
        return db.collection('users')
            .findOne(
                { email: email })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.log('error')
            });
    }
}