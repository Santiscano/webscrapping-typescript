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
      `SELECT NEW_CAMPAING FROM ${this.table} LIMIT 1`
    );
    return data;
  }

  static async updateNewCampaigns(newCampaign: string, ID: number) {
    const [result] = await connection.query(
      `
      UPDATE ${this.table}
      SET NEW_CAMPAING = ?
      WHERE ID = ?
      `,
      [newCampaign, ID]
    );
    return result;
  }
}

export default Cedis;
