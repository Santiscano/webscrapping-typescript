import { listCedisActive } from "../config/ListCedisActive";
import CedisReques from "../models/cedis.model";
import WebScrapping from "../models/TBPEDIDOSNOVAVENTA.model";

interface CedisRequestType {
  ID:number,
  SCRAP_NAME: string,
  CEDI_OPTION_CODE: number,
  CEDI: number,
  ACTIVO: boolean,
  SECOND_PREVIOUS_CAMPAING: string,
  PREVIOUS_CAMPAING: string,
  CURRENT_CAMPAING: string,
  NEW_CAMPAING: string,
  POSITION_CAMPAING: number,
}
class RunScrapps {

  static async bucleScrapp() {
    const listCedis = listCedisActive;
    console.log('cedis que se van a ejecutar', listCedis);
    try {
      const runPromises = async () => {
        const cedis = await CedisReques.getCedis() as CedisRequestType[];
        const cedis_by_active = cedis.filter(cedisItem => listCedis.includes(String(cedisItem.ID)));
        console.log('cedis activos', cedis_by_active);
        const promises = cedis_by_active.map(cedisItem => this.runForCedi(cedisItem));
        await Promise.allSettled(promises);
      }
      await runPromises(); // se disparan la funcion runForCedi la cantidad de cedis que haya en la base de datos
    } catch (error) {
      console.error(`fallo la ejecucion de runBucleScrapp con error: ${error}`);
    } finally {
      setTimeout(() => this.bucleScrapp(), 20 * 1000); // se ejecuta cada 20 segundos y se llama a si mismo
    }
  };

  static async runForCedi({ ID, CEDI_OPTION_CODE, CEDI,
    CURRENT_CAMPAING, PREVIOUS_CAMPAING, SECOND_PREVIOUS_CAMPAING, 
    POSITION_CAMPAING 
  }: CedisRequestType) {
    try {
      if ( POSITION_CAMPAING >= 3 ) {
        POSITION_CAMPAING = 0 // convertirlo aqui
        await CedisReques.updatePositionCampaing(0, ID); // actualizar valor en base de datos
      }
      
      const campaings = [ CURRENT_CAMPAING, PREVIOUS_CAMPAING, SECOND_PREVIOUS_CAMPAING ];

      /**
       * Scrapping principal de descarga de archivo de reportes general de operacion
       */
      await WebScrapping.getCampaingsNovaventaModel(
        campaings[POSITION_CAMPAING], // camapaña a descargar
        String(CEDI_OPTION_CODE), // cedi a descargar
        "REPORTE GENERAL DE OPERACION", // nombre del archivo
        CEDI // cedi a descargar
      );

      /**
       * Este scrapp es para la configuracion de devoluciones 
       * !ahora tiene un error porque la base de datos no tiene los datos correctos
       */
      await WebScrapping.NoveltyNovaventaModel(
        campaings[POSITION_CAMPAING],
        String(CEDI_OPTION_CODE),
        "REPORTE GENERAL OPERACION DEVOLUCIONES NOVAVENTA SCO",
        CEDI
      );

      // esperar 5 minutos para ejecutar el siguiente scrapping
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));

      const newPosition = POSITION_CAMPAING + 1;
      await CedisReques.updatePositionCampaing(newPosition, ID);
      console.log(`termino por completo el scrapping de codigo cedi: ${CEDI_OPTION_CODE}/${campaings[POSITION_CAMPAING]}`,);
    } catch (error) {
      console.error(`fallo la ejecucion de 4 minutos con error: ${error}`)
    }
  };

};

export default RunScrapps
