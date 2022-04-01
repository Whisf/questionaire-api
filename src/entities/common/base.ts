import { Column, PrimaryGeneratedColumn } from 'typeorm'

export class Base {
  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ type: 'timestamptz' })
  public createdAt: Date

  @Column({ type: 'timestamptz' })
  public updatedAt: Date
}
