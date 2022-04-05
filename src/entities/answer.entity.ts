import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Base } from './common'
import { Question } from './question.entity'
import { UserQuestionAnswer } from './user-question-answer.entity'

@Entity('answer')
export class Answer extends Base {
  constructor() {
    super()
  }

  @Column()
  public description: string

  @Column()
  public isTrue: boolean

  @Column()
  public questionId: string

  @OneToMany(() => UserQuestionAnswer, (userQuestionAnswer: UserQuestionAnswer) => userQuestionAnswer.question)
  public userQuestionAnswers: UserQuestionAnswer[]

  @ManyToOne(() => Question, (question: Question) => question.answers, { onDelete: 'CASCADE' })
  public question: Question
}
