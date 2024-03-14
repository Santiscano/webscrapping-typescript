import WebScrapping from "../models/TBPEDIDOSNOVAVENTA.model";
import { requestData as req } from "../docs/novaventa";
import campaingsModel from "../models/campaings.model";


class RunScrapps {

  static position = 0;
  
  static runEveryFifteenMinutes() {
    try {
      console.log('start run scrapp to 15 min');
  
      this.runEveryFourMinutes();
  
      const intervalAction = setInterval(() => {
        this.runEveryFourMinutes();
      }, 1000 * 60 * 4) // cada 4 minutos

      setTimeout(() => {
        clearInterval(intervalAction);
        console.log("Terminando el proceso de scraping de 15 min");
      }, 1000 * 60 * 14) // finaliza todo al minuto 14 el proceso de los 4 min
    } catch (error) {
      throw new Error(`fallo la ejecucion de 15min con error: ${error}`);
    }
  };

  static async runEveryFourMinutes() {
    try {
      console.log(`entro a run every four minutes por ${this.position + 1} vez`);
      
      // traer data api y  transformar
      const data = (await campaingsModel.getCampaings()).data[0];
      const campaingsObj = {
        SECOND_PREVIOUS_CAMPAING: data.SECOND_PREVIOUS_CAMPAING,
        PREVIOUS_CAMPAING: data.PREVIOUS_CAMPAING,
        CURRENT_CAMPAING: data.CURRENT_CAMPAING
      }
      console.log('campaingsObj: ', campaingsObj);
      const campaings = Object.values(campaingsObj)
      console.log(`re-iniciamos scrapping con campaña ${campaings[this.position]}`);

      // validamos posicion a ejecutar
      if ( this.position >= 3 ) {
        this.position = 0
      };
      
      /**
       * *Scrapping principal de descarga de archivo de reportes general de operacion
       */
      WebScrapping.getCampaingsNovaventaModel(
        campaings[this.position],
        "REPORTE GENERAL DE OPERACION"
      );
  
      /**
       * *Este scrapp es para la configuracion de devoluciones 
       * !ahora tiene un error porque la base de datos no tiene los datos correctos
       */
      WebScrapping.caliCampaingsNovaventaModel(
        campaings[this.position],
        "REPORTE GENERAL OPERACION DEVOLUCIONES NOVAVENTA SCO"
      );
  
      this.position++;
    } catch (error) {
      throw new Error(`fallo la ejecucion de 4 minutos con error: ${error}`)
    }
  };

};

export default RunScrapps
