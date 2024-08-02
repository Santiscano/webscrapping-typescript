import WebScrapping from "../models/TBPEDIDOSNOVAVENTA.model";
import campaingsModel from "../models/cedis.model";
import { listCedisActive } from '../config/ListCedisActive';

interface CedisRequestType {
  ID: number;
  NEW_CAMPAING: string;
  CEDI_OPTION_CODE:string;
}

class RunValidateCampaign {

  static async bucleValidateCampaign() {
    const listCedis = listCedisActive;
    console.log('cedis a ejecutar validacion', listCedis);
    try {
      const runPromises = async () => {
        const newCampaigns = await campaingsModel.getCedis() as CedisRequestType[];
        const campaigns_by_active = newCampaigns.filter(campaignsItem => listCedis.includes(String(campaignsItem.ID)));
        console.log('cedis activos', campaigns_by_active);
        const promises = campaigns_by_active.map(item => this.runForCedi(item));
        Promise.allSettled(promises).then(() => {
          setTimeout(() => {
            console.log(['ALERT'], 'se esta re-invocando la funcion validacion de campañas');
            this.bucleValidateCampaign();
          }, 5 * 60 * 1000); // se ejecuta cada 5 minutos y se llama a si mismo
        })
      };
      await runPromises(); // se dispara la funcion por cada cedi que haya en la base de datos
    } catch (error) {
      console.error(`fallo la ejecucion de bucleValidateCampaign con error: ${error}`);
    } finally {
      console.log('llego a finally');
      setTimeout(() => this.bucleValidateCampaign(), 2 * 60 * 60 * 1000); // se ejecuta cada 2 horas y se llama a si mismo
    }
  }

  static async runForCedi({ NEW_CAMPAING, CEDI_OPTION_CODE, ID }: CedisRequestType) {
    try {
      await WebScrapping.validateNewCampaing(NEW_CAMPAING, CEDI_OPTION_CODE, ID);

      await new Promise(resolve => setTimeout(resolve, 12 * 60 * 60 * 1000)); // se ejecuta cada 12 horas
      console.log('termino por completo la validacion la nueva campaña');
    } catch (error) {
      console.error(`fallo la ejecucion de runForCedi con error: ${error}`);
    }
  }
}

export default RunValidateCampaign;
