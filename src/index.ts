// CLASES
import { Server } from './services';

const server = new Server();

server.serverOn();

// ======================= bucle para descargar archivo ======================== //
import WebScrapping from "./models/TBPEDIDOSNOVAVENTA.model";;
import { requestData as req } from './docs/novaventa';

let position = 0;
console.log(`scrapping inicial con campaña: ${req.body.campaings[0]}`);

const runEveryFifteenMinutes = () => {
  console.log('inicia ejecucion cada 15 min');
  
  async function runEveryFourMinutes(){
    console.log('entro a run every four minutes')
    await WebScrapping.multiCampaingsNovaventaModel(req.body.campaings[position]);
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
  }, 1000 * 60 * 13 ); // finaliza todo al minuto 13
};

// primer llamado
runEveryFifteenMinutes();

// bucle de scrapp
setInterval( () => {
  runEveryFifteenMinutes();
}, 1000 * 60 * 15 ); // cada 15 minutos se ejecuta


