// CLASES
import { Server } from "./services";

const server = new Server();

server.serverOn();



// ======================= bucle para descargar archivo ======================== //
import RunScrapps from "./services/RunScrapps";
import TBPEDIDOSNOVAVENTAModel from "./models/TBPEDIDOSNOVAVENTA.model";

// primer llamado
RunScrapps.runEveryFifteenMinutes();
// bucle de scrapp
setInterval(RunScrapps.runEveryFifteenMinutes, 1000 * 60 * 15); // cada 15 minutos se ejecuta


/**
 * *validar nuevas campañas cada 6 horas
 * *Este scrapping valida si hay una nueva campaña y si la hay cambia el array de campañas
 * *ya tiene la validacion para el cambio de año para incrementarlo cuando el año cambia
*/
// TBPEDIDOSNOVAVENTAModel.validateNewCampaing();
// setInterval( TBPEDIDOSNOVAVENTAModel.validateNewCampaing, 1000 * 60 * 30 ) // cada 30 minutos se ejecuta
