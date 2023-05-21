import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        // Schema whatever was present in data.js
        name : { type : String, required : true },
        email : { type: String, required: true, unique: true },
        password : { type: String, required: true },
        isAdmin : { type: Boolean, required: true, default: false },
    },
    {
        // options for schema which gets automatically added to above schema
        timestamps : true
    }
);

const User = mongoose.model('User', UserSchema);
export default User;