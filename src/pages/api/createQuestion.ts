import { qStemService } from '@server/services/qStem'
import { apiController } from '@utils/api'
import { ID } from 'src/types/common'

export interface CreateQStemParams {
  qstemObj: {
    stem_text: string
    explanation: string
    action_verb: string[]
    keyword: string[]
    cid: ID
    options: ID[]
    optionSets: ID[]
    learning_objective: string
  }
}

export interface CreateQStemResults {
  data: string
}

export default apiController<CreateQStemParams, CreateQStemResults>(async ({ qstemObj }, user) => {
  const qStem = await qStemService.create({ uid: user.id, ...qstemObj })

  return {
    data: qStem.id,
  }
})
