import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import User from "./User.model";
import Role from "./Role.model";

@Table({ tableName: "UserRoles", timestamps: false })
class UserRole extends Model {
    @ForeignKey(() => User)
    @Column
    declare UserId: number;

    @ForeignKey(() => Role)
    @Column
    declare RoleId: number;
}

export default UserRole;
