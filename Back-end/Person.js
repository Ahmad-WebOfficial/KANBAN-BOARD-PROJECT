import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

const Person = mongoose.models.Person || mongoose.model("Person", personSchema);

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  }, 
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export { Person, Task };
