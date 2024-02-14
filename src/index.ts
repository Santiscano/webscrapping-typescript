// CLASES
import { Server } from './services';

const server = new Server();

server.serverOn();

// ======================= bucle para descargar archivo ======================== //
import WebScrapping from "./models/TBPEDIDOSNOVAVENTA.model";;
import { requestData as req } from './docs/novaventa';
import TBPEDIDOSNOVAVENTAModel from './models/TBPEDIDOSNOVAVENTA.model';

let position = 0;

const runEveryFifteenMinutes = () => {
  console.log('start run scrapp to 15 min');
  
  function runEveryFourMinutes(){
    console.log('entro a run every four minutes')
    // WebScrapping.getCampaingsNovaventaModel(
    //   req.body.campaings[position],
    //   "REPORTE GENERAL DE OPERACION"
    // );
    WebScrapping.caliCampaingsNovaventaModel(
      req.body.campaings[position],
      "REPORTE GENERAL DE OPERACION SCO CALI"
    );
    TBPEDIDOSNOVAVENTAModel.validateNewCampaing();


    position++
    if(position >= req.body.campaings.length){
      position = 0;
    };
  };

  runEveryFourMinutes();

  const intervalAction = setInterval(() => {
    console.log(`re-iniciamos scrapping con campaña: ${req.body.campaings[position]}`);
    runEveryFourMinutes()
  }, 1000 * 60 * 4); // cada 4 minutos

  setTimeout(() => {
    clearInterval(intervalAction);
    console.log('finalizo todo el ciclo de 15 min')
  }, 1000 * 60 * 14 ); // finaliza todo al minuto 13
};

// primer llamado
runEveryFifteenMinutes();

// bucle de scrapp
setInterval( () => {
  runEveryFifteenMinutes();
}, 1000 * 60 * 15 ); // cada 15 minutos se ejecuta


// ==================== bucle de devoluciones =========================== //

