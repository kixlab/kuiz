import { Class, ClassModel } from '@server/db/class'
import { apiController } from '@utils/api'
import { Types } from 'mongoose'
import { ID } from 'src/types/common'

export interface LoadTopicsParams {
  cid: ID
}

export interface LoadTopicsResults {
  topics: string[]
}

export default apiController<LoadTopicsParams, LoadTopicsResults>(async ({ cid }) => {
  const targetClass: Class | null = await ClassModel.findById(new Types.ObjectId(cid))
  if (targetClass) {
    return {
      topics: targetClass.topics,
    }
  }
  throw new Error('Class not found')
})
