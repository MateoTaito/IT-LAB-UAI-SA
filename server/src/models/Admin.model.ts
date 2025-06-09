import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import User from "./User.model";

@Table({
    tableName: "Admin",
})

class Admin extends Model {

    // Admin ID
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare Id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    declare UserId: number;

    @BelongsTo(() => User)
    declare UserFK: number;

    @Column({
        type: DataType.STRING
    })
    declare Password: string;

}
export default Admin