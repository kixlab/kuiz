import { OptionModel } from '@server/db/option'
import { QStem, QStemModel } from '@server/db/qstem'
import { apiController } from '@utils/api'
import { ID } from 'src/types/common'

export interface LoadUserActivityParams {
  cid: ID
  topic?: string
}

export interface LoadUserActivityResults {
  numberOfStems: number
  numberOfOptions: number
}

export default apiController<LoadUserActivityParams, LoadUserActivityResults>(async ({ cid, topic = '' }, user) => {
  const qStems: QStem[] =
    (await QStemModel.find({
      class: { $eq: cid },
      learningObjective: { $regex: topic, $options: 'i' },
      author: user.id,
    })) ?? []

  const questionsOfTopic: QStem[] =
    (await QStemModel.find({
      class: { $eq: cid },
      learningObjective: { $regex: topic, $options: 'i' },
    })) ?? []

  const qOptions =
    (await OptionModel.find({
      class: { $eq: cid },
      qstem: { $in: questionsOfTopic.map(qStem => qStem._id) },
      author: user.id,
    })) ?? []

  return {
    numberOfStems: qStems.length,
    numberOfOptions: qOptions.length - qStems.length,
  }
})
