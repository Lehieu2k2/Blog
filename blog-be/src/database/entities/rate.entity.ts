import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

export const TABLE_RATES = 'Rates';
@Entity(TABLE_RATES)
export class RateEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  postId: string;

  @Column()
  ip: string;

  @Column()
  star: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => PostEntity, (post) => post.rates)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
