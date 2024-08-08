import cron from 'node-cron';

import RunScrapps from "./services/RunScrapps";
import RunValidateCampaign from "./services/RunValidateCampaign";

// Función para calcular los minutos de ejecución
function calculateIntervals(numItems: number): number[] {
  const interval = Math.floor(60 / numItems); // Calcular el intervalo en minutos
  const intervals = [];
  
  for (let i = 0; i < numItems; i++) {
    intervals.push(i * interval + 1); // +1 para evitar ejecutar en el minuto 0
  }

  return intervals;
}

// Función para programar tareas cron
function scheduleCrons(listCedisActive: any[]) {
  const intervals = calculateIntervals(listCedisActive.length);
  console.log('Intervals:', intervals);

  intervals.forEach((minute, index) => {
    cron.schedule(`${minute} * * * *`, () => {
      console.log(`Ejecutando tarea para CEDI ${listCedisActive[index]}`);
      // Aquí puedes llamar la función específica que quieras ejecutar
      // RunScrapps.bucleScrapp(listCedisActive[index]);
      // RunValidateCampaign.bucleValidateCampaign(listCedisActive[index]);
      RunScrapps.runForCedi(listCedisActive[index]);
      RunValidateCampaign.runForCedi(listCedisActive[index]);
    });
  });
}

// Programar las tareas cron cada hora
cron.schedule('0 * * * *', async () => {
  const listCedisActive = await RunScrapps.getCedis(); // Obtener la lista de CEDIS activos
  console.log("Cantidad de CEDIS activos:", listCedisActive.length);
  
  // Limpiar tareas cron previas
  cron.getTasks().forEach((task) => task.stop());
  
  scheduleCrons(listCedisActive);
});

async function startScrapp() {
  const listCedisActive = await RunScrapps.getCedis(); // Obtener la lista de CEDIS activos
  console.log("start Cantidad de CEDIS activos:", listCedisActive.length);
  
  // Limpiar tareas cron previas
  cron.getTasks().forEach((task) => task.stop());
  
  scheduleCrons(listCedisActive);
}
startScrapp();
