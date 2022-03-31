import { Entity, ManyToOne } from 'typeorm'
import { Answer } from './answer.entity'
import { Base } from './common'
import { Question } from './question.entity'
import { User } from './user.entity'

@Entity('user_question_answer')
export class UserQuestionAnswer extends Base {
  constructor() {
    super()
  }

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  public user: User

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  public question: Question

  @ManyToOne(() => Answer, { onDelete: 'CASCADE' })
  public answer: Answer
}
