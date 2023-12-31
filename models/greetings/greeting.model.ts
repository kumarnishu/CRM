import mongoose from "mongoose"
import { IGreeting } from "../../types/greeting.types"

const GreetingSchema = new mongoose.Schema<IGreeting, mongoose.Model<IGreeting, {}, {}>, {}>({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        lowercase: true
    },
    category: {
        type: String,
        lowercase: true
    },
    mobile: {
        type: String,
        lowercase: true,
        required: true
    },

    is_active: {
        type: Boolean,
        default: true,
    },
    last_run_date: {
        type: Date
    },
    dob_time: Date,
    anniversary_time: Date,
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
   
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Greeting = mongoose.model<IGreeting, mongoose.Model<IGreeting, {}, {}>>("Greeting", GreetingSchema)