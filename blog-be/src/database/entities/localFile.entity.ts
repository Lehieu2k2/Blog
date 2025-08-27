import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export const TABLE_LocalFiles = 'LocalFiles';
@Entity(TABLE_LocalFiles)
export class LocalFile {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint' })
  userId: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  pathConvert: string;

  @Column()
  mimetype: string;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
