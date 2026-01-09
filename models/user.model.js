import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { required } from 'zod/mini';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  }
});

userSchema.pre('save',async function(){
  if(!this.isModified('password'))return;
  const salt = await bcrypt.gensalt(10);
  this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.isPasswordValid= async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
userSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

export default mongoose.model("User", userSchema);

