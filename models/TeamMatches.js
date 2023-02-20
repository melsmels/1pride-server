import mongoose from "mongoose";

const teamMatchesSchema = mongoose.Schema({
    metadata: {
        type: Object
    },
    info: {
        type: Object
    }
}, {
    timestamps: true
})

const TeamMatches = mongoose.model('TeamMatches', teamMatchesSchema)

export default TeamMatches