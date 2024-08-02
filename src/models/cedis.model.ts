import { connection } from "../config/database/mysql";

class Cedis {
  static table = "TB_RUTAS_WEBSCRAP";

  static async getCedis() {
    const [data] = await connection.query(`SELECT * FROM ${this.table}`);
    return data;
  }

  static async updatePositionCampaing(newPosition: number, ID: number) {
    const [result] = await connection.query(
      `
      UPDATE ${this.table}
      SET POSITION_CAMPAING = ?
      WHERE ID = ?
      `,
      [newPosition, ID]
    );
    return result;
  }

  static async getNewCampaigns() {
    const [data] = await connection.query(
      `SELECT ID, NEW_CAMPAING FROM ${this.table} LIMIT 1`
    );
    return data;
  }

  static async updateNewCampaigns(ID: number) {
    const [result] = await connection.query(
      `
      UPDATE ${this.table}
      SET 
        SECOND_PREVIOUS_CAMPAING = LPAD(CAST(CAST(SECOND_PREVIOUS_CAMPAING AS UNSIGNED) + 1 AS CHAR), LENGTH(SECOND_PREVIOUS_CAMPAING), '0'),
        PREVIOUS_CAMPAING = LPAD(CAST(CAST(PREVIOUS_CAMPAING AS UNSIGNED) + 1 AS CHAR), LENGTH(PREVIOUS_CAMPAING), '0'),
        CURRENT_CAMPAING = LPAD(CAST(CAST(CURRENT_CAMPAING AS UNSIGNED) + 1 AS CHAR), LENGTH(CURRENT_CAMPAING), '0'),
        NEW_CAMPAING = LPAD(CAST(CAST(NEW_CAMPAING AS UNSIGNED) + 1 AS CHAR), LENGTH(NEW_CAMPAING), '0')
      WHERE ID = ?
      `,
      [ID]
    );
    return result;
  }
}

export default Cedis;
