import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import User from "./User.model";
import Career from "./Career.model";

@Table({ tableName: "UserCareers", timestamps: false })
class UserCareer extends Model {
    @ForeignKey(() => User)
    @Column
    declare UserId: number;

    @ForeignKey(() => Career)
    @Column
    declare CareerId: number;
}

export default UserCareer;
