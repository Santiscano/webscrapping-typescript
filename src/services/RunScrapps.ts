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
    console.log('entro a run every four minutes');
    console.log('position: ', this.position);

    if (this.position >= req.body.campaings.length) {
      this.position = 0
    };
    
    // WebScrapping.getCampaingsNovaventaModel(
    //   req.body.campaings[this.position],
    //   "REPORTE GENERAL DE OPERACION"
    // );

    // WebScrapping.caliCampaingsNovaventaModel(
    //   req.body.campaings[this.position],
    //   "REPORTE GENERAL DE OPERACION SCO CALI"
    // );

    TBPEDIDOSNOVAVENTAModel.validateNewCampaing();

    this.position++;
  };

};

export default RunScrapps
