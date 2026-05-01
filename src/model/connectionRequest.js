const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    FromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ToUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'rejected', 'ignored', 'accepted'],
            message: `{VALUE} is not a valid status type`,
        }
    },
    
},
    {
        timestamps: true
    }
)

connectionRequestSchema.index({ ToUserId: 1, FromUserId: 1 });  // compound index will enhance the search efficiency of mongodb 

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.FromUserId.equals(connectionRequest.ToUserId)) {
        throw new Error("You can't send request to yourself !");
    }
    next;
})

const connectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModel;