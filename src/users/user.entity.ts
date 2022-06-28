import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report: Report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log("user inserted with id: ", this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log("user updated with id: ", this.id);
    }

    @AfterRemove()
    logDelete() {
        console.log("user deleted with id: ", this.id);
    }
}