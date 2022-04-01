import { Column, Entity, OneToMany } from 'typeorm'
import { Base } from './common'
import { Question } from './question.entity'

@Entity('question_category')
export class QuestionCategory extends Base {
  constructor() {
    super()
  }

  @Column()
  public title: string

  @OneToMany(() => Question, (question: Question) => question.questionCategory)
  public questions: Question[]
}
