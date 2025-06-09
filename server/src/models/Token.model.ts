import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo, Unique } from "sequelize-typescript";
import Admin from "./Admin.model";

@Table({
    tableName: "Token",
})
class Token extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare Id: number;

    @ForeignKey(() => Admin)
    @Unique // Ensure one token per admin (1:1 relationship)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare AdminId: number;

    @BelongsTo(() => Admin)
    declare Admin: Admin;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare Token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare ExpiresAt: Date;
}

export default Token;
