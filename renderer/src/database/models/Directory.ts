import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Directory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  integrity_hash: string;
  @Column('text', { nullable: false, unique: true })
  uri: string;
  @Column('text', { nullable: true })
  parent_directory_id: string;
  @Column('text', { nullable: false })
  file_name: string;
  @Column('integer', { nullable: false })
  size: number;
  @Column('text', { nullable: false })
  mime: string;
  @Column('datetime', { nullable: false })
  date_created: Date;
  @Column('datetime', { nullable: false })
  date_modified: Date;
  @CreateDateColumn()
  date_indexed?: Date;
}
