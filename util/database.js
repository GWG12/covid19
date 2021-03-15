import mongodb from 'mongodb';


const MongoClient = mongodb.MongoClient;
//const URI = process.env.MONGODB_URI;

let _db;

export const mongoConnect = async callback => {
    console.log('adentro papaw')
    const URI = process.env.MONGODB_URI;
    try {
        const client = await MongoClient.connect(URI, { useUnifiedTopology: true });
        _db = client.db();
        callback();
    } catch (err) {
        console.log(err);
    }
};

export const getDb = () => {
    if (_db) {
        return _db;
    }
    throw Error('No database found');
};

