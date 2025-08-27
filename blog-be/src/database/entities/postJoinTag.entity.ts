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
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

export const TABLE_POST_JOIN_TAGS = 'PostJoinTags';
@Entity(TABLE_POST_JOIN_TAGS)
export class PostJoinTagEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  postId: string;

  @Column()
  tagId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => PostEntity, (post) => post.postJoinTags)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @ManyToOne(() => TagEntity, (tag) => tag.postJoinTags)
  @JoinColumn({ name: 'tagId' })
  tag: TagEntity;
}
