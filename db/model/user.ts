import {Document, Schema, model, models} from 'mongoose'

export interface User extends Document {
	email: string,
  password?: string|null,
  name: string,
  role: string,
  status: string,
  registeredAt: Date,
  registeredVia: string|null
}

const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [emailRegex, 'Email address not valid.']
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    minLength: [3, 'Name cannot be less than 3 characters'],
    maxLength: [64, 'Name cannot be more than 64 characters']
  },
  role: {
    type: String,
    required: [true, 'User Role is required.']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'banned']
  },
  registeredAt: {
    type: Date
  },
  registeredVia: {
    type: String
  }
})

const userModel = models.User || model<User>("User", UserSchema)

export default userModel