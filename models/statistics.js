import { getDb } from '../util/database.js';


export class Statistics {

    static async syncDatabase(data) {
        const db = getDb();
        // Simulate atomic operations by splitting the inserting process into three steps
        // Step 1: extract current collections; if statistics collection doesn't exist,
        // insert all data and create new statistics collection
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(elem => elem.name);
        if (!collectionNames.includes('statistics')) {
            console.log('no hay nada')
            try {
                await db.collection('statistics').insertMany(data);
                return { message: 'Database successfully synced!' };
            } catch (err) {
                return { error: 'Could not sync data, please try again later' };
            }
        }
        try {
            // Step 2: If it already exists, rename old statistics collection to 
            // keep it as an insurance in case insert fails
            await db.collection('statistics').rename('statistics1');
            try {
                await db.collection('statistics').insertMany(data);
            } catch (err) {
                // If inserting operation failed, keep old collection and rename it back to
                // statistics
                await db.collection('statistics1').rename('statistics');
                return { error: 'Could not sync data, please try again later' };
            }
            // Step 3: If inserting was successful, drop renamed original collection and
            // keep new synced collection under the name of "statistics" that "overwrote" the original collection
            let droppedOriginalCollection
            while (!droppedOriginalCollection) {
                droppedOriginalCollection = await db.collection('statistics1').drop();
            }
            return { message: 'Database successfully synced!' };
        } catch (err) {
            return { error: 'Could not sync data, please try again later' };
        }
    }

    static async getAllCountries() {
        const db = getDb();
        try {
            const result = await db.collection('statistics').find().toArray();
            return result;
        } catch (err) {
            return null;
        }
    }

}