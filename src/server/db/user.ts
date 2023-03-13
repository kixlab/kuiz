import { Schema, model, Types, models } from 'mongoose'
import { Doc } from 'src/types/common'

export interface User extends Doc {
  name: string
  studentID?: string
  email: string
  imageUrl: string
  classes: Types.ObjectId[]
  made: Types.ObjectId[]
  madeOptions: Types.ObjectId[]
  solved: {
    question: Types.ObjectId
    history: {
      optionSet: Types.ObjectId[]
      initAns: Types.ObjectId
      isCorrect: boolean
    }
  }[]
  isAdmin: boolean
  authId: string
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    max: 32,
    trim: true,
  },
  studentID: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  authId: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  classes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    default: [],
  },
  made: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Qstem',
      },
    ],
    default: [],
  },
  madeOptions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Option',
      },
    ],
    default: [],
  },
  solved: {
    type: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: 'Qstem',
        },
        history: {
          type: Object,
          default: {
            optionSet: [
              {
                type: Schema.Types.ObjectId,
                ref: 'Option',
              },
            ],
            initAns: {
              type: Schema.Types.ObjectId,
              ref: 'Option',
            },
            isCorrect: {
              type: Boolean,
            },
          },
        },
      },
    ],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

export const UserModel = models?.User ?? model<User>('User', UserSchema)
