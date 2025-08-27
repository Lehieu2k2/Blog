import { PostJoinTagEntity } from 'src/database/entities/postJoinTag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
export const TABLE_TAGS = 'Tags';
@Entity(TABLE_TAGS)
export class TagEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PostJoinTagEntity, (postTag) => postTag.tag)
  postJoinTags: PostJoinTagEntity[];
}
