import { ClassModel } from '@server/db/class'
import { Topic, TopicModel } from '@server/db/topic'
import { apiController } from '@utils/api'
import { Types } from 'mongoose'
import { ID } from 'src/types/common'

export interface LoadClassInfoParams {
  cid: ID
}

export interface LoadClassInfoResults {
  name: string
  topics: Topic[]
  studentsNumber: number
  qstemsNumber: number
  currentTopic: ID | null
}

export default apiController<LoadClassInfoParams, LoadClassInfoResults>(async ({ cid }) => {
  const courseClass = await ClassModel.findById(new Types.ObjectId(cid))
  const topics = await TopicModel.find({ class: new Types.ObjectId(cid) })
  return {
    name: courseClass.name,
    topics,
    studentsNumber: courseClass.students.length,
    qstemsNumber: courseClass.qstems.length,
    currentTopic: courseClass.currentTopic,
  }
})
