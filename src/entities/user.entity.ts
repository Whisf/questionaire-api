import { Column, Entity, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm'
import { Base } from './common'
import { UserQuestionAnswer } from './user-question-answer.entity'

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  BASIC = 'BASIC',
}

@Entity('user')
@Tree('closure-table', {
  closureTableName: 'user_closure',
  ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
  descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
export class User extends Base {
  constructor() {
    super()
  }

  @Column({ nullable: false })
  public email: string

  @Column({ default: USER_ROLE.BASIC })
  public role: USER_ROLE

  @Column({ type: 'jsonb', default: new Date(Date.now()) })
  public lastActivity: string

  @Column()
  public authzUserId: string

  @TreeParent({ onDelete: 'SET NULL' })
  public parent: User

  @TreeChildren()
  public children: User[]

  @OneToMany(() => UserQuestionAnswer, (userQuestionAnswer: UserQuestionAnswer) => userQuestionAnswer.user)
  public userQuestionAnswers: UserQuestionAnswer[]
}
