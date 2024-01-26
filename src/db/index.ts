import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";

const uri =
  "mongodb+srv://rcupull:Alcatraz-32286-elocality-db@cluster0.3ageacp.mongodb.net/?retryWrites=true&w=majority";

type DBName = "elocality-db";
type CollectionName = "users";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectCRUD = async (args: {
  callback: (args: {
    client: MongoClient;
    db: Db;
    collection: Collection;
  }) => Promise<void> | void;
  dbName: DBName;
  collectionName: CollectionName;
}) => {
  const { callback, collectionName, dbName } = args;

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const db = client.db(dbName);

    const collection = db.collection(collectionName);

    await callback({ client, collection, db });
  } finally {
    await client.close();
  }
};
