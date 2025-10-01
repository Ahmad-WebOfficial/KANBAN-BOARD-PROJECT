import mongoose from "mongoose";

function connectToMongoDB() {
  mongoose
    .connect(
      "mongodb+srv://kanbanboard:1122334455@mypersonalcluster.mesbsq1.mongodb.net/todoApp?retryWrites=true&w=majority&appName=myPersonalCluster",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err);
    });
}

export default connectToMongoDB;

// import mongoose from "mongoose";

// function connectToMongoDB() {
//   mongoose
//     .connect("mongodb://127.0.0.1:27017/todoApp")
//     .then(() => {
//       console.log("MongoDB connected successfully");
//     })
//     .catch((err) => {
//       console.error("MongoDB connection failed:", err);
//     });
// }

// export default connectToMongoDB;
