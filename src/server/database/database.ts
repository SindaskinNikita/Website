import { DataSource } from "typeorm"
import { Employee } from "../entities/Employee"
import { Facility } from "../entities/Facility"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "src/server/database/database.sqlite",
    entities: [Employee, Facility],
    synchronize: true,
    logging: true,
})
