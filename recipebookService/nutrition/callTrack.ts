import mongoose from "mongoose";

const callTrackSchema = new mongoose.Schema(
  {
    keyword: String,
  },
  { collection: "fdc_keyword_calls" },
);

const model = mongoose.model("CallTrackModel", callTrackSchema);

export default model;
