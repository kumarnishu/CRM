import mongoose from "mongoose"
import { ITask } from "../../types/task.types"

const TaskSchema = new mongoose.Schema<ITask, mongoose.Model<ITask, {}, {}>, {}>({
    task_description: {
        type: String,
        lowercase: true,
        required: true
    },
    boxes: [{
        date: { type: Date },
        is_completed: { type: Boolean }
    }],
    frequency_value: Number,
    frequency_type: { type: String },
    created_at: {
        type: Date,
        default: new Date(),
        required: true,

    },
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

export const Task = mongoose.model<ITask, mongoose.Model<ITask, {}, {}>>("Task", TaskSchema)