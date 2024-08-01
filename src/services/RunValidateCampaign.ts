import WebScrapping from "../models/TBPEDIDOSNOVAVENTA.model";
import campaingsModel from "../models/cedis.model";
import { FIRST_CEDI, SECOND_CEDI, THIRD_CEDI } from "../config/configPorts";

interface CedisRequestType {
  ID: number;
  NEW_CAMPAING: string;
  CEDI_OPTION_CODE:string;
}

class RunValidateCampaign {

  static async bucleValidateCampaign() {
    // const listCedisActive = [ FIRST_CEDI, SECOND_CEDI, THIRD_CEDI ];
    const listCedisActive = [ FIRST_CEDI ];
    try {
      const runPromises = async () => {
        const newCampaigns = await campaingsModel.getCedis() as CedisRequestType[];
        const campaigns_by_active = newCampaigns.filter(campaignsItem => listCedisActive.includes(String(campaignsItem.ID)));
        const promises = campaigns_by_active.map(item => this.runForCedi(item));
        await Promise.allSettled(promises);
      };
      await runPromises(); // se dispara la funcion por cada cedi que haya en la base de datos
    } catch (error) {
      console.error(`fallo la ejecucion de bucleValidateCampaign con error: ${error}`);
    } finally {
      setTimeout(() => this.bucleValidateCampaign(), 20 * 1000); // se ejecuta cada 20 segundos y se llama a si mismo
    }
  }

  static async runForCedi({ NEW_CAMPAING, CEDI_OPTION_CODE, ID }: CedisRequestType) {
    try {
      await WebScrapping.validateNewCampaing(NEW_CAMPAING, CEDI_OPTION_CODE, ID);
    } catch (error) {
      console.error(`fallo la ejecucion de runForCedi con error: ${error}`);
    }
  }
}

export default RunValidateCampaign;
