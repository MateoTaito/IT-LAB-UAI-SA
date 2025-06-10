import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from "sequelize-typescript";

@Table({
    tableName: "Reason",
})
class Reason extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    declare Id: number;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    declare Name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare Description: string;
}

export default Reason;
