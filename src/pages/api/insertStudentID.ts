import { apiController } from '@utils/api'

export interface PutStudentIDParams {
  studentID: string
}

export interface PutStudentIDResults {
  res: string
}

export default apiController<PutStudentIDParams, PutStudentIDResults>(async ({ studentID }, user) => {
  if (user) {
    const updatedUser = await user.updateOne({ $set: { studentID: studentID } })
    if (updatedUser) {
      return { res: updatedUser.studentID }
    }
  }
  throw new Error('User not found')
})
