import { UserEntity } from 'src/database/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';

export const TABLE_COMMENTS = 'Comments';
@Entity(TABLE_COMMENTS)
export class CommentEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  content: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  website: string;

  @Column({ type: 'boolean' })
  isRobot: boolean;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'bigint' })
  postId: string;

  @Column({ type: 'bigint' })
  parentId: string;

  @Column({ type: 'bigint' })
  creatorId: string;

  @Column({ type: 'bigint', nullable: true })
  moderatorId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creatorId' })
  creator: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'moderatorId' })
  moderator: UserEntity;

  @ManyToOne(() => PostEntity)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.children)
  @JoinColumn({ name: 'parentId' })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  children: CommentEntity[];
}
