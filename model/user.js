const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String, required:true},
    hashedPassword: {type: String, required:true}
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
     //   console.log('Before', returnedObject)
        delete returnedObject.hashedPassword;
        return returnedObject
    },
});
const User = mongoose.model('User', userSchema)

module.exports = User