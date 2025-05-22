import { DataSource } from "typeorm"
import { Employee } from "../entities/Employee"
import { Facility } from "../entities/Facility"
import { env } from "../config/env"

export const PostgresDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "NiceDbPassword",
    database: "postgres",
    schema: "public",
    entities: [Employee, Facility],
    synchronize: false,
    logging: ["query", "error"],
    logger: "advanced-console"
}) 