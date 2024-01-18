import * as mysql from "mysql2/promise";
import "dotenv/config";
import { 
  DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_DATABASE, 
  E_CONTROL_REPORT_DB_HOST, E_CONTROL_REPORT_DB_USER, E_CONTROL_REPORT_DB_DATABASE, E_CONTROL_REPORT_DB_PORT, E_CONTROL_REPORT_DB_PASSWORD, 
} from "../configPorts";

// @ts-ignore
export const connection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
})

export const connectionCristianBD = mysql.createPool({
  host: "62.72.8.157",
  user: "remoto-control",
  database: "e-control",
  port: 8443,
  password: "ZlC4QTqZdS19azWXQB5c----",
})
