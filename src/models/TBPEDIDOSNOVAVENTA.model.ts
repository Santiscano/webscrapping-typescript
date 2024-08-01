import fs from 'fs';
import path from 'path';

import puppeteer, { Browser, executablePath, HTTPRequest, HTTPResponse } from "puppeteer";

import cedisModel from './cedis.model';
import { requestData } from '../docs/novaventa';
import ApiResponses from "../helpers/apiResponse";
import Excel from "../helpers/filesExcel";
import { resStatus } from "../helpers/resStatus";
import SqlCrud from "../helpers/sqlCrud";
import SQLResponse from "../interfaces/sql2";
import campaingsModel from './campaings.model';

class TBPEDIDOSNOVAVENTAModel {
  protected static headless: boolean | "new" | undefined = "new";
  protected static configLaunch = { 
    headless: this.headless,
    executablePath: '/usr/bin/chromium-browser', // comentar si no se esta en linux
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };

  // *===========================SCRAPPING BASE=========================== *//
  static async getCampaingsNovaventaModel(campaing:string, codeCedi:string, fileName:string, Cedi:number) {
    console.log(`inicia scrapping de campaña: ${campaing} con cedi: ${codeCedi} - ${Cedi}`);
    const tempDir = `../../temp/${codeCedi}/${campaing}`;
    const { login, password } = requestData.body;
    this.createDirectories(codeCedi, campaing); // crear difectorio si no existe
    this.deleteFilesPreivous(fileName, tempDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch) // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, tempDir)
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');

      await page.setRequestInterception(true); // Habilitamos la interceptación de solicitudes
      page.on('request', this.request);
      page.on('response', (response) => this.downloadExcel( response, browser, fileName, tempDir, Cedi )); // escuchando evento de descarga

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();

      const formReporter = await page.waitForSelector('#SqlFields');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", codeCedi);
      await page.type("#param4", campaing);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };
  // *=============================DEVOLUCIONES=========================== *//
  static async NoveltyNovaventaModel(campaing:string, codeCedi:string, fileName:string, Cedi:number) {
    console.log(`inicia scrapping de devoluciones de campaña: ${campaing} con cedi: ${codeCedi} - ${Cedi}`);
    const temDir = `../../temp/${codeCedi}/${campaing}`;
    const { login, password } = requestData.body;

    // eliminamos archivos
    this.deleteFilesPreivous(fileName, temDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, temDir)
      }) // esta linea es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');

      await page.setRequestInterception(true);
      page.on('request', this.request);
      page.on('response', (response) => this.downloadExcel( response, browser, fileName, temDir, Cedi ));

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(12) a');
      await buttonRedirecOperation?.click();

      const formReporter = await page.waitForSelector('#SqlFields');

      await page.type("#param2", campaing);
      // await page.type("#param3", "novaventa"); // no lo contiene el formulario
      await page.select("#param4", codeCedi);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };



  // *===================== METHODS COMPLEMENTS SCRAPPING DEVOLUTIONS ===== *//
  static createDirectories(codeCedi:string, campaing:string, origin = 'temp') {
    const baseDir = path.join(__dirname, origin);
    const cediDir = path.join(baseDir, codeCedi.toString());
    const campaignDir = path.join(cediDir, campaing.toString());
    try {
      if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
      if (!fs.existsSync(cediDir)) fs.mkdirSync(cediDir);
      if (!fs.existsSync(campaignDir)) fs.mkdirSync(campaignDir);
    } catch (err) {
      console.error(`Error creating directories: ${err}`);
    }
  }

  static deleteFilesPreivous(fileName:string, tempDir:string) {
    const filePath1 = path.join(__dirname, tempDir, `${fileName}.xls`);
    const filePath2 = path.join(__dirname, tempDir, `${fileName.replace(" ", "-")}.xlsx`);
    if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);
    if(fs.existsSync(filePath2)) fs.unlinkSync(filePath2);
  }

  static request(interceptedRequest: HTTPRequest) {
    if (
      interceptedRequest.resourceType() === 'stylesheet' ||
      interceptedRequest.resourceType() === 'image' ||
      interceptedRequest.resourceType() === 'font'
    ) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  }

  static async downloadExcel( 
    response: HTTPResponse, browser: Browser, 
    fileName:string, temDir:string, Cedi:number
  ) {
    const contentDisposition = response.headers()['content-disposition'];
    if ( contentDisposition && contentDisposition.startsWith('attachment') ) {
      const filenameDown = contentDisposition.split("filename=")[1].trim(); 
      if (filenameDown == `${fileName}.xls`) {
        await this.validateExcelPath(path.join(__dirname, temDir, `${fileName}.xls`), Cedi)
        browser.close();
        setTimeout(() => this.updateReportDB(fileName, temDir, Cedi), 3000);
      }
    };
  };

  static async validateExcelPath (filePath:string, Cedi:number) {
    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        if (fs.existsSync(filePath)) {
          clearInterval(intervalo);
          resolve("Archivo encontrado");
        } else {
          console.log('esperando archivo de cedi: ', Cedi);
        }
      }, 300 );
    })
  };

  static async updateReportDB(fileName:string, tempDir:string, Cedi:number) {
    try {
      const filePath = path.join( __dirname, tempDir, `${fileName}.xls` );
      const newFilePath = path.join( __dirname, tempDir, `${fileName.replace(" ", "-")}.xlsx` );

      const buffer = fs.readFileSync(filePath);
      const ArrayExcel = await Excel.ExcelToArray( buffer, "xls", 1, 2, filePath, newFilePath );
      // @ts-ignore
      const ExcelWithCedi = ArrayExcel.map((item) => ({ ...item, Cedi: Number(Cedi) }));
      console.log('primer item que insertara, ya tiene cedi: ', ExcelWithCedi[0]);

      if (Array.isArray(ArrayExcel) && ArrayExcel.every(item => typeof item === 'object') ) {
        if (fileName === "REPORTE GENERAL DE OPERACION") {
          const insertUpdateData = await TBPEDIDOSNOVAVENTAModel.insertOrUpdateTBPEDIDOSNOVAVENTA( 
            'TB_PEDIDOS_NOVAVENTA_TEST',
            ExcelWithCedi,
            'Numero_Boleta',
            [
              'Ciudad', 'Seccion', 'Zona', 'Valor_Venta', 'Factura_De_Venta', 'Fecha_De_Venta'
            ]
          );
        }
        if (fileName == "REPORTE GENERAL OPERACION DEVOLUCIONES NOVAVENTA SCO") {
          const insertDevolucionesNovaventa = await TBPEDIDOSNOVAVENTAModel.insertorUpdateDevolucionesNovaventa(
            'TB_DEVOLUCIONES_NOVAVENTA_TEST',
            ExcelWithCedi,
            '',
            []
          );
        }
        // eliminamos archivos
        this.deleteFilesPreivous(fileName, tempDir);
        console.log(`termino el proceso de insert a las ${Date.now()}`);
        return;
      }

    } catch (error) {
      console.log('error en ejecucion capturado por el catch: ', error);
    }
  };



  // *=============================ACTUALIZAR DATABASE===================== *//
  static async insertOrUpdateTBPEDIDOSNOVAVENTA( table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [] ) {
    const excludeFieldsEControl = [...excludeFields, "Nombre_Plataforma"];
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFieldsEControl );

    const excludeFieldsCristian = [...excludeFields, "Estado_ans", "Fecha_promesa2", "Estado_promesa" ];
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian } };
  };

  static async insertorUpdateDevolucionesNovaventa( table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [] ) {
    const excludeFieldDevoluciones = [ ...excludeFields ];
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFieldDevoluciones );

    const excludeFieldsCristian = [ ...excludeFields ];
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian }};
  }


  // !=============================SIN ACTUALIZAR===================== *//
  static async validateNewCampaing( campaingValidate:string, codeCedi:string, id:number, fileName = "REPORTE GENERAL DE OPERACION") {
    let isPageForm = false;
    const temDir = `../../temp/${codeCedi}/${campaingValidate}`;
    const { login, password } = requestData.body;
    this.createDirectories(codeCedi, campaingValidate); // crear difectorio si no existe
    this.deleteFilesPreivous(fileName, temDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, temDir)
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');

      // Habilitamos la interceptación de solicitudes
      await page.setRequestInterception(true);
      page.on('request', this.request);
      page.on( 'response', (response) => this.validateDownloadExcel(response, browser, fileName, campaingValidate, id) );
      page.on( 'load', () => {
        if (isPageForm) {
          console.log('no hay datos para esta campaña');
          browser.close();
        } else {
          console.log('cargo la pagina antes de ingresar al formulario')
        }
      })

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();

      const formReporter = await page.waitForSelector('#SqlFields');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", "96673");
      await page.type("#param4", String(campaingValidate));

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      isPageForm = true;
      console.log('Esperando descarga de archivo');
    } catch (error) {
      console.error(`no se termino el scrapping por el error: ${error}`);
    }
  };

  static async validateDownloadExcel(response: HTTPResponse, browser: Browser, fileName:string, newCampaing:string, id:number) {
    const contentDisposition = response.headers()['content-disposition'];
    
    if ( contentDisposition && contentDisposition.startsWith('attachment')) {
      const filename = contentDisposition.split("filename=")[1].trim(); 
      console.log('filename download: ', filename);
      
      if (filename.includes('.xls')) {
        await this.validateExcelPath(path.join(__dirname, "../../temp/validate", `${fileName}.xls`), id);
        browser.close();

        setTimeout(() => {
          // eliminamos archivos
          const filePath1 = path.join(__dirname, "../../temp/validate", `${fileName}.xls`);
          if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);

          this.updateListCampaingModel(newCampaing, id);

        }, 3000)
      }
    }
  };

  static async updateListCampaingModel(newCampaing:string, id:number) {
    await cedisModel.updateNewCampaigns(newCampaing, id);
    return true;
  };
  // !================================================================ *//
}

export default TBPEDIDOSNOVAVENTAModel;
