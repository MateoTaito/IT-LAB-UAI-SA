import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    BelongsToMany,
} from "sequelize-typescript";

@Table({
    tableName: "Instance",
})
class Instance extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    declare Id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare InstanceId: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare Name: string;

    @Column({
        type: DataType.STRING,
    })
    declare Description: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
    })
    declare Port: number;

    @Column({
        type: DataType.STRING,
    })
    declare Enviroment: string;
}

export default Instance;
