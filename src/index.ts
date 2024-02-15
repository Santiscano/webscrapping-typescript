// CLASES
import { Server } from "./services";

const server = new Server();

server.serverOn();



// ======================= bucle para descargar archivo ======================== //
import RunScrapps from "./services/RunScrapps";

// primer llamado
RunScrapps.runEveryFifteenMinutes();
// bucle de scrapp
setInterval(RunScrapps.runEveryFifteenMinutes, 1000 * 60 * 15); // cada 15 minutos se ejecuta
