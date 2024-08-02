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
  private static tableName = 'TB_PEDIDOS_NOVAVENTA';
  private static tableDevoluciones = 'TB_DEVOLUCIONES_NOVAVENTA';

  protected static headless: boolean | "new" | undefined = "new";
  protected static configLaunch = { 
    headless: this.headless,
    // executablePath: '/usr/bin/chromium-browser', // !comentar si no se esta en linux
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  };

  // *===========================SCRAPPING BASE=========================== *//
  static async getCampaingsNovaventaModel(campaing:string, codeCedi:string, fileName:string, Cedi:number) {
    console.log(['SCRAPPING'], `inicia scrapping de ${codeCedi}/${campaing} - cedi: ${Cedi}`);
    const tempDir = `../../temp/${codeCedi}/${campaing}`;
    const { login, password } = requestData.body;

    this.createDirectories(codeCedi, campaing); // crear difectorio si no existe
    this.deleteFilesPrevious(fileName, tempDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch) // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, tempDir)
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      // console.log(['SCRAPPING'], `abrimos web de insitusales ${codeCedi}/${campaing}`);

      await page.setRequestInterception(true); // Habilitamos la interceptación de solicitudes
      page.on('request', this.request);
      page.on('response', (response) => this.downloadExcel( 
        response, browser, fileName, tempDir, Cedi 
      )); // escuchando evento de descarga

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      // console.log(['SCRAPPING'], `login exitoso ${codeCedi}/${campaing}`);

      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();
      // console.log(['SCRAPPING'], `redireccion a reportes ${codeCedi}/${campaing}`);

      const formReporter = await page.waitForSelector('#SqlFields');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", codeCedi);
      await page.type("#param4", campaing);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      console.log(['SCRAPPING'], `se dio click a descargar reporte ${codeCedi}/${campaing}`);
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };
  // *=============================DEVOLUCIONES=========================== *//
  static async NoveltyNovaventaModel(campaing:string, codeCedi:string, fileName:string, Cedi:number) {
    console.log(['DEVOLUCIONES'], `inicia scrapping de devoluciones de ${codeCedi}/${campaing} - cedi: ${Cedi}`);
    const temDir = `../../temp/devolutions/${codeCedi}/${campaing}`;
    const { login, password } = requestData.body;

    this.createDirectories(codeCedi, campaing, 'temp/devolutions'); // crear difectorio si no existe
    this.deleteFilesPrevious(fileName, temDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, temDir)
      }) // esta linea es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      // console.log(['DEVOLUCIONES'], `abrimos web de insitusales devoluciones ${codeCedi}/${campaing}`);

      await page.setRequestInterception(true);
      page.on('request', this.request);
      page.on('response', (response) => this.downloadExcel( response, browser, fileName, temDir, Cedi ));

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      // console.log(['DEVOLUCIONES'],`login exitoso devoluciones ${codeCedi}/${campaing}`);
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(12) a');
      await buttonRedirecOperation?.click();
      // console.log(['DEVOLUCIONES'], `redireccion a reportes devoluciones ${codeCedi}/${campaing}`);

      const formReporter = await page.waitForSelector('#SqlFields');

      await page.type("#param2", campaing);
      // await page.type("#param3", "novaventa"); // no lo contiene el formulario
      await page.select("#param4", codeCedi);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      // console.log(['DEVOLUCIONES'], `se dio click a descargar reporte devoluciones ${codeCedi}/${campaing}`);
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

  static deleteFilesPrevious(fileName:string, tempDir:string) {
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
        await this.validateExcelPath(path.join(__dirname, temDir, `${fileName}.xls`), Cedi);
        browser.close();
        // console.log(['SUCCESS'],`se encontro el archivo: ${fileName} cedi: ${Cedi}`);
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
          // console.log(['SUCCESS'], `archivo de cedi: ${Cedi} encontrado en path: `, filePath);
        } else {
          // console.log('esperando archivo de cedi: ', Cedi);
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
      // console.log('primer item que insertara, ya tiene cedi: ', ExcelWithCedi[0]);

      if (Array.isArray(ArrayExcel) && ArrayExcel.every(item => typeof item === 'object') ) {
        if (fileName === "REPORTE GENERAL DE OPERACION") {
          // console.log(`inicia proceso de insert de cedi ${Cedi} a las: `, Date.now());
          const insertUpdateData = await TBPEDIDOSNOVAVENTAModel.insertOrUpdateTBPEDIDOSNOVAVENTA( 
            this.tableName,
            ExcelWithCedi,
            'Numero_Boleta',
            [
              'Ciudad', 'Seccion', 'Zona', 'Valor_Venta', 'Factura_De_Venta', 'Fecha_De_Venta'
            ],
            Cedi
          );
        }
        if (fileName == "REPORTE GENERAL OPERACION DEVOLUCIONES NOVAVENTA SCO") {
          const insertDevolucionesNovaventa = await TBPEDIDOSNOVAVENTAModel.insertorUpdateDevolucionesNovaventa(
            this.tableDevoluciones,
            ExcelWithCedi,
            '',
            [],
            Cedi
          );
        }
        // eliminamos archivos
        this.deleteFilesPrevious(fileName, tempDir);
        console.log(`termino el proceso de insert a las ${Date.now()}`);
        return;
      }

    } catch (error) {
      console.log('error en ejecucion capturado por el catch: ', error);
    }
  };



  // *=============================ACTUALIZAR DATABASE===================== *//
  static async insertOrUpdateTBPEDIDOSNOVAVENTA( 
    table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [],
    cedi: number
  ) {
    const excludeFieldsEControl = [...excludeFields, "Nombre_Plataforma"];
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFieldsEControl, cedi );

    const excludeFieldsCristian = [...excludeFields, "Estado_ans", "Fecha_promesa2", "Estado_promesa" ];
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian } };
  };

  static async insertorUpdateDevolucionesNovaventa( 
    table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [],
    cedi: number
  ) {
    const excludeFieldDevoluciones = [ ...excludeFields ];
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFieldDevoluciones, cedi );

    const excludeFieldsCristian = [ ...excludeFields ];
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian }};
  }


  // !=============================SIN ACTUALIZAR:VALIDAR NUEVA CAMPAÑA===================== *//
  static async validateNewCampaing( campaingValidate:string, codeCedi:string, id:number, fileName = "REPORTE GENERAL DE OPERACION") {
    console.log(['VALIDATE NEW CAMPAIGN', `${codeCedi}/${campaingValidate}`]);
    let isPageForm = false;
    const temDir = `../../temp/validate/${codeCedi}/${campaingValidate}`;
    const { login, password } = requestData.body;
    
    this.createDirectories(codeCedi, campaingValidate, 'temp/validate'); // crear difectorio si no existe
    this.deleteFilesPrevious(fileName, temDir); // eliminamos archivos anteriores

    try {
      const browser = await puppeteer.launch(this.configLaunch); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();
      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, temDir)
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      // console.log(['VALIDATE NEW CAMPAIGN'], `abrimos web de insitusales ${codeCedi}/${campaingValidate}`);

      // Habilitamos la interceptación de solicitudes
      await page.setRequestInterception(true);
      page.on('request', this.request);
      // *si se descarga el archivo se actualiza la campaña y 
      page.on( 'response', (response) => this.validateDownloadExcel(
        response, browser, fileName, campaingValidate, id, 
        temDir, Number(codeCedi)
      ));
      page.on( 'load', () => {
        if (isPageForm) {
          console.log(['WARNING'], 'no hay datos para esta campaña');
          browser.close();
        } else {
          console.log(['ERROR'], 'No se llego hasta el formulario');
        }
      })

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      // console.log(['VALIDATE NEW CAMPAIGN'], `login exitoso ${codeCedi}/${campaingValidate}`);
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();
      // console.log(['VALIDATE NEW CAMPAIGN'], `redireccion a reportes ${codeCedi}/${campaingValidate}`);

      const formReporter = await page.waitForSelector('#SqlFields');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", String(codeCedi));
      await page.type("#param4", String(campaingValidate));

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();

      isPageForm = true; // llegamos a la pagina del formulario ahora se activa
      // console.log([campaingValidate], 'Esperando descarga de archivo');
    } catch (error) {
      console.error(`no se termino el scrapping por el error: ${error}`);
    }
  };

  static async validateDownloadExcel(
    response: HTTPResponse, browser: Browser, 
    fileNameAssigned:string, campaingValidate:string, id:number, 
    temDir: string, Cedi:number
  ) {
    const contentDisposition = response.headers()['content-disposition'];
    if ( contentDisposition && contentDisposition.startsWith('attachment')) {
      const filename = contentDisposition.split("filename=")[1].trim(); 
      // console.log('filename validate download: ', filename);
      if (filename.includes('.xls')) {
        await this.validateExcelPath(path.join(__dirname, temDir, `${fileNameAssigned}.xls`), Cedi);
        browser.close();
        // console.log(['SUCCESS'],`se actualizara la campaña de la cedi: ${Cedi}`);
        setTimeout(async () => {
          this.deleteFilesPrevious(fileNameAssigned, temDir);
          await cedisModel.updateNewCampaigns(id);
        }, 3000);
        console.log(['VALIDATE NEW CAMPAIGN'], `se actualizo la campaña de la cedi: ${Cedi}`);
      }
    }
  };

  static async updateListCampaings() {

  }
  // !================================================================ *//
}

export default TBPEDIDOSNOVAVENTAModel;
