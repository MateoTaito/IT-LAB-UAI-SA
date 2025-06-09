import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, Unique, BelongsToMany } from "sequelize-typescript"
import Role from "./Role.model";
import Career from "./Career.model";
import UserRole from "./UserRole.model";
import UserCareer from "./UserCareer.model"

@Table({
    tableName: "User",
})

class User extends Model {
    // TODO Add Nature of the variables
    // Id of the User
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER
    })
    declare Id: number;

    // Rut Identificator of the User
    @Unique
    @Column({
        type: DataType.STRING
    })
    declare Rut: string;

    // Email of the User
    @Unique
    @Column({
        type: DataType.STRING
    })
    declare Email: string;

    // Name of the User
    @Column({
        type: DataType.STRING
    })
    declare Name: string;

    // LastName of the User
    @Column({
        type: DataType.STRING
    })
    declare LastName: string;


    @BelongsToMany(() => Role, () => UserRole)
    declare Roles: Role[];

    @BelongsToMany(() => Career, () => UserCareer)
    declare Careers: Career[];

}
export default User
