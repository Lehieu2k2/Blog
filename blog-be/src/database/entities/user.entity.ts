import { UserRole } from 'src/constant/db/user-role';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRefreshToken } from './userRefreshToken.entity';

export const TABLE_USERS = 'Users';

@Entity(TABLE_USERS)
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'int', nullable: true })
  gender: number;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'boolean' })
  isVerified: boolean;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: UserRefreshToken[];
}
