import { asyncHandler } from "../utils/asyncHandler.js"
import { Watchlist } from "../models/watchlist.model.js"

const updateWatchlist = asyncHandler(async (req, res) => {
    const { user } = req.cookies
    const { name, index, pairs } = req.body

    if (pairs.length < 1) pairs = []

    try {
        const watchlist = await Watchlist.findOneAndUpdate(
            {
                user: user,
                index: Number(index)
            },
            {
                users: user,   // Reference to the user
                name: name,
                index: Number(index),
                pairs: pairs
            },
            {
                new: true,
                upsert: true
            }
        )
        return res.status(201).json({
            message: 'Watchlist update successfully',
        })

    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }

})

const addPair = asyncHandler( async (req, res) => {
    const { user } = req.cookies
    const { name, index, pairs } = req.body

    const filter = {
        user: user,
        index: index,
        name: name
    }

    const update = {
        pairs: pairs 
    }

    try {
        const result = await Watchlist.findOneAndUpdate(filter, update, {
            new: true, // Returns the updated document
            upsert: true // Creates the document if it doesn't exist
        })

        if (result) {
            return res.status(200).json({
                message: 'Pairs updated successfully',
                // data: result
            })
        } else {
            return res.status(404).json({ message: 'Document not found' })
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating pairs',
            error: error.message
        })
    }
})

const fetchWatchlist = asyncHandler(async (req, res) => {
    const { user } = req.body

    if (user === null || user === undefined) {
        res
            .status(400)
            .json({ message: 'user null' })
    }

    if (user) {
        try {
            const watchlist = await Watchlist.find({ user: user})

            res
            .status(200)
            .json({
                watchlist: watchlist
            })
        } catch (error) {
            res
                .status(501)
                .json({ message: error })
        }
    }
})

export { updateWatchlist, addPair, fetchWatchlist }