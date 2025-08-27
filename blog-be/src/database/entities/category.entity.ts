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

export const TABLE_CATEGORIES = 'Categories';
@Entity(TABLE_CATEGORIES)
export class CategoryEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: true })
  parentId: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'int' })
  status: number;

  @Column()
  content: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => PostEntity, (post) => post.category)
  posts: PostEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];
}
