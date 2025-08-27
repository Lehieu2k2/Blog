import { CategoryEntity } from 'src/database/entities/category.entity';
import { CommentEntity } from 'src/database/entities/comment.entity';
import { LocalFile } from 'src/database/entities/localFile.entity';
import { PostJoinTagEntity } from 'src/database/entities/postJoinTag.entity';
import { RateEntity } from 'src/database/entities/rate.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export const TABLE_POSTS = 'Posts';
@Entity(TABLE_POSTS)
export class PostEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  title: string;

  @Column({ type: 'bigint' })
  userId: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  thumbnailId: string;

  @Column({ type: 'bigint' })
  categoryId: string;

  @Column()
  slug: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'bigint', nullable: true })
  moderatorId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'moderatorId' })
  moderator: UserEntity;

  @OneToOne(() => LocalFile)
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: LocalFile;

  @ManyToOne(() => CategoryEntity, (category) => category.posts)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @OneToMany(() => RateEntity, (rate) => rate.post)
  rates: RateEntity[];

  totalRates?: number;
  averageRate?: number;

  @OneToMany(() => CommentEntity, (r) => r.post)
  comments: CommentEntity[];

  @OneToMany(() => PostJoinTagEntity, (postTag) => postTag.post)
  postJoinTags: PostJoinTagEntity[];
}
