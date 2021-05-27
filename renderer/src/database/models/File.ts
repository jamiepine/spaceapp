import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  integrity_hash: string;
  @Column('text', { nullable: false, unique: true })
  uri: string;
  @Column('text', { nullable: false })
  file_name: string;
  @Column('integer', { nullable: false })
  size: number;
  @Column('text', { nullable: false })
  mime: string;
  @Column('text', { nullable: true })
  thumbnail: boolean;
  @Column('text', { nullable: true })
  extension: string;

  @Column('datetime', { nullable: false })
  date_created: Date;
  @Column('datetime', { nullable: false })
  date_modified: Date;
  @CreateDateColumn()
  date_indexed?: Date;

  @Column('text', { nullable: true })
  geolocation?: string;
}
