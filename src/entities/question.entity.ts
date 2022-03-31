import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Answer } from './answer.entity'
import { Base } from './common'
import { QuestionCategory } from './question-category.entity'
import { UserQuestionAnswer } from './user-question-answer.entity'

@Entity('question')
export class Question extends Base {
  @Column()
  public description: string

  @OneToMany(() => Answer, (answer: Answer) => answer.question)
  public answers: Answer[]

  @OneToMany(() => UserQuestionAnswer, (userQuestionAnswer: UserQuestionAnswer) => userQuestionAnswer.question)
  public userQuestionAnswers: UserQuestionAnswer[]

  @ManyToOne(() => QuestionCategory, (questionCategory: QuestionCategory) => questionCategory.questions, {
    onDelete: 'CASCADE',
  })
  public questionCategory: QuestionCategory
}
