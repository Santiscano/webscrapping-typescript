import SqlCrud from "../helpers/sqlCrud";

class campaingsModel {
  static table = "TB_CAMPAINGS";

  static async createcampaings() {
    return await SqlCrud.insert(
      this.table,
      [
        "SECOND_PREVIOUS_CAMPAING",
        "PREVIOUS_CAMPAING",
        "CURRENT_CAMPAING",
        "NEW_CAMPAING",
      ],
      ["202401", "202402", "202403", "202404"]
    );
  }

  static async getCampaings() {
    return await SqlCrud.getRowByAttribute(this.table, "id", 1);
  }

  static async updatedCampaing(data: {}) {
    return await SqlCrud.updateRow(this.table, "id", 1, { ...data });
  }
}

export default campaingsModel;
