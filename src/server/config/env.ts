import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Загружаем .env файл из корня проекта
dotenv.config({ path: resolve(__dirname, '../../../.env') })

export const env = {
    database: {
        host: process.env["DB_HOST"] || "localhost",
        port: parseInt(process.env["DB_PORT"] || "5432"),
        username: process.env["DB_USERNAME"] || "postgres",
        password: process.env["DB_PASSWORD"] || "postgres",
        name: process.env["DB_NAME"] || "equipment_management"
    }
} 