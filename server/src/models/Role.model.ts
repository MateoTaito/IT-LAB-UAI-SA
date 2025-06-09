import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript"
import User from "./User.model";
import UserRole from "./UserRole.model";

@Table({
    tableName: "Role",
})

class Role extends Model {
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
        type: DataType.STRING,
        allowNull: true
    })
    declare Description: string;

    @BelongsToMany(() => User, () => UserRole)
    declare Users: User[];

}
export default Role