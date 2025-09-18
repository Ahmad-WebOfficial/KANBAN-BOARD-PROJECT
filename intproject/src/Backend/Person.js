import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true }, 
  password: { type: String, required: true }
});

export default mongoose.model("Person", personSchema);

// hlo ahmad bilal
