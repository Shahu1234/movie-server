import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    cast: {
        type: [String],
        required: true
    },
}, {
    timestamps:true
});
export default mongoose.model("Movie", movieSchema);