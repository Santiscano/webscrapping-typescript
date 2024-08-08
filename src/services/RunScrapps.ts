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

  static timeInterval = 7 * 60 * 1000;

  static async getCedis() {
    const cedis = await CedisReques.getCedis() as CedisRequestType[];
    return cedis;
  };

  static async bucleScrapp() {
    const listCedis = listCedisActive;
    // console.log('cedis a ejecutar scrapp principal', listCedis);
    try {
      const runPromises = async () => {
        const cedis = await CedisReques.getCedis() as CedisRequestType[];
        const cedis_by_active = cedis.filter(cedisItem => listCedis.includes(String(cedisItem.ID)));
        // console.log('cedis activos', cedis_by_active);
        const promises = cedis_by_active.map(cedisItem => this.runForCedi(cedisItem));
        Promise.allSettled(promises).then(() => {
          setTimeout(() => {
            console.log(['ALERT'], 'se esta re-invocando la funcion scrapp principal');
            this.bucleScrapp();
          }, this.timeInterval ); // se ejecuta cada 7 minutos y se llama a si mismo
        })
      };
      await runPromises(); // se disparan la funcion runForCedi la cantidad de cedis que haya en la base de datos
    } catch (error) {
      console.error(`fallo la ejecucion de scrapp principal con error: ${error}`);
    } finally {
      // console.log('llego a finally');
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
      console.log('cedi: ', CEDI, ', posicion campaña', POSITION_CAMPAING, ', campaña: ', campaings[POSITION_CAMPAING]);

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

      const newPosition = POSITION_CAMPAING + 1;
      await CedisReques.updatePositionCampaing(newPosition, ID);
      console.log(`se actualizo la posicion de la camapaña ${CEDI}/${campaings[POSITION_CAMPAING]} a ${CEDI}/${campaings[newPosition]}`);
      console.log(`termino por completo el scrapping de codigo cedi: ${CEDI_OPTION_CODE}/${campaings[POSITION_CAMPAING]}`,);
    } catch (error) {
      console.error(`fallo la ejecucion de 4 minutos en cedi: ${CEDI}, con error: ${error}`)
    }
  };

};

export default RunScrapps
