import WebScrapping from "../models/TBPEDIDOSNOVAVENTA.model";
import { requestData as req } from "../docs/novaventa";
import TBPEDIDOSNOVAVENTAModel from "../models/TBPEDIDOSNOVAVENTA.model";


class RunScrapps {

  static position = 0
  
  static runEveryFifteenMinutes() {
    console.log('start run scrapp to 15 min');

    this.runEveryFourMinutes();

    const intervalAction = setInterval(() => {
      console.log(`re-iniciamos scrapping con campaña ${req.body.campaings[this.position]}`);
      this.runEveryFourMinutes();
    }, 1000 * 60 * 4) // cada 4 minutos

    setTimeout(() => {
      clearInterval(intervalAction);
      console.log("Terminando el proceso de scraping de 15 min");
    }, 1000 * 60 * 14) // finaliza todo al minuto 14 el proceso de los 4 min
  };

  static runEveryFourMinutes() {
    console.log(`entro a run every four minutes por ${this.position + 1} vez`);

    if (this.position >= req.body.campaings.length) {
      this.position = 0
    };
    
    /**
     * *Scrapping principal de descarga de archivo de reportes general de operacion
     */
    WebScrapping.getCampaingsNovaventaModel(
      req.body.campaings[this.position],
      "REPORTE GENERAL DE OPERACION"
    );

    /**
     * *Este scrapp es para la configuracion de devoluciones y ahora esta en espera de confirmar continuacion
     * !ahora tiene un error porque la base de datos no tiene los datos correctos
     */
    // WebScrapping.caliCampaingsNovaventaModel(
    //   req.body.campaings[this.position],
    //   "REPORTE GENERAL DE OPERACION SCO CALI"
    // );

    /**
     * *Este scrapping valida si hay una nueva campaña y si la hay cambia el array de campañas
     * *ya tiene la validacion para el cambio de año para incrementarlo cuando el año cambia
     */
    TBPEDIDOSNOVAVENTAModel.validateNewCampaing();

    this.position++;
  };

};

export default RunScrapps
