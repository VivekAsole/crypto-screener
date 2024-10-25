import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    }, // watchlist name
    index: { 
        type: Number, 
        required: true 
    }, // Index name
    pairs: [{
        type: String,
    }] // Array of stock/currency pairs 
});

export const Watchlist = mongoose.model('Watchlists', watchlistSchema);