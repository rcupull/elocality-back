import { connect } from "mongoose";

// type dbName = "elocality_auth";

// const getUri = (db: dbName) => {
//   return `mongodb+srv://rcupull:Alcatraz-32286-elocality-db@cluster0.3ageacp.mongodb.net/${db}?retryWrites=true&w=majority`;
// };

// const elocalityAuthUri = getUri("elocality_auth");

export const connectDB = () => {
  connect("mongodb://127.0.0.1:27017/community_db")
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
    });
};
