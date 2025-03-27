import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema ({
    videoFile: {
        type: String,    //  we will received this from the cloudinary and will store url in the database
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desciption: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},{ timestamps: true});

export const Video = mongoose.model("Video", videoSchema);