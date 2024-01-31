// CLASES
import { Server } from './services';

const server = new Server();

server.serverOn();

// ======================= bucle para descargar archivo ======================== //
import WebScrapping from './controllers/scrapping.controller';

const req = {
  body: {
    login: "admin@SOLUCIONES.com", 
    password: "Admin@SOLUCIONES.com", 
    campaing: [ "202318", "202401", "202402" ]
  }
};

// console.log(`scrapping inicial con campaña: ${req.body.campaing}`);
// @ts-ignore
// WebScrapping.novaventa(req );

// bucle de scrapp
setInterval( () => {
  // console.log(`re-iniciamos scrapping con campaña: ${req.body.campaing}`)
  // @ts-ignore
  // WebScrapping.novaventa(req );
}, 1000 * 60 * 5 ); // cada 5 minutos se ejecuta

