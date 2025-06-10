import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, BelongsToMany } from "sequelize-typescript";
import User from "./User.model";
import UserCareer from "./UserCareer.model";

@Table({
    tableName: "Career",
})
class Career extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare Id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    declare Name: string;

    @Column({
        type: DataType.STRING
    })
    declare Description: string;

    @BelongsToMany(() => User, () => UserCareer)
    declare Users: User[];
}

export default Career;