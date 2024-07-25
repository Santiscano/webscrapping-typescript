// CLASES
import { Server } from "./services";

const server = new Server();

server.serverOn();



// ======================= bucle para descargar archivo ======================== //
import RunScrapps from "./services/RunScrapps";
import RunValidateCampaign from "./services/RunValidateCampaign";

// RunScrapps.bucleScrapp();
RunValidateCampaign.bucleValidateCampaign();
