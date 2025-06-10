import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./User.model";
import Reason from "./Reason.model";

@Table({
    tableName: "Attendance",
})
class Attendance extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    declare Id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare UserId: number;

    @BelongsTo(() => User)
    declare User: User;

    @ForeignKey(() => Reason)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare ReasonId: number;

    @BelongsTo(() => Reason)
    declare Reason: Reason;

    @Column({ type: DataType.DATE, allowNull: false })
    declare CheckIn: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    declare CheckOut: Date | null;
}

export default Attendance;
