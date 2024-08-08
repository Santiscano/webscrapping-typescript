import cron from 'node-cron';

import RunScrapps from "./services/RunScrapps";
import RunValidateCampaign from "./services/RunValidateCampaign";

// Función para calcular los minutos de ejecución
function calculateIntervals(numItems: number): number[] {
  const interval = Math.floor(30 / numItems); // Calcular el intervalo en minutos
  const intervals = [];
  
  for (let i = 0; i < numItems; i++) {
    intervals.push(i * interval + 1); // +1 para evitar ejecutar en el minuto 0
  }

  for (let i = 0; i < numItems; i++) {
    intervals.push(i * interval + 31); // +31 para ejecutar en la segunda mitad de la hora
  }

  return intervals;
}

// Función para programar tareas cron
function scheduleCrons(listCedisActive: any[]) {
  const intervals = calculateIntervals(listCedisActive.length);
  console.log('Intervals:', intervals);
  listCedisActive.push(...listCedisActive); // Duplicar la lista para ejecutar en dos mitades de la hora

  intervals.forEach((minute, index) => {
    cron.schedule(`${minute} * * * *`, () => {
      console.log('index:', index, 'minute:', minute, 'listCedisActive:', listCedisActive[index]);
      console.log(`Ejecutando tarea para CEDI ${JSON.stringify(listCedisActive[index])}`);
      RunScrapps.runForCedi(listCedisActive[index]);
      RunValidateCampaign.runForCedi(listCedisActive[index]);
    });
  });
}

async function startScrapp() {
  const listCedisActive = await RunScrapps.getCedis(); // Obtener la lista de CEDIS activos
  
  // Limpiar tareas cron previas
  cron.getTasks().forEach((task) => task.stop());
  
  scheduleCrons(listCedisActive);
}

// Programar las tareas cron cada hora
cron.schedule('0 * * * *', startScrapp );

startScrapp();
