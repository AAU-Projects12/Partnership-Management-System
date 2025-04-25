import mongoose from "mongoose";

const campusSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Campus = mongoose.model("Campus", campusSchema);
export default Campus;
