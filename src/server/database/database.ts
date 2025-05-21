import { DataSource } from "typeorm"
import { Employee } from "../entities/Employee"
import { Facility } from "../entities/Facility"
import { News } from "../entities/News"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "src/server/database/database.sqlite",
    entities: [Employee, Facility, News],
    synchronize: true,
    logging: true,
})
