import fs from 'fs';
import path from 'path';

import { Response } from 'express';
import puppeteer, { Browser, HTTPResponse } from "puppeteer";

import SqlCrud from "../helpers/sqlCrud";
import Excel from "../helpers/filesExcel";
import ApiResponses from "../helpers/apiResponse";
import { resStatus } from "../helpers/resStatus";
import SQLResponse from "../interfaces/sql2";
import { requestData } from '../docs/novaventa';
import { ENVIRONMENT } from '../config/configPorts';

class TBPEDIDOSNOVAVENTAModel {
  protected static headless: boolean | "new" | undefined = "new";

  static async updateListCampaingModel(newCampaing:string) {

    const fileToRead = ENVIRONMENT == 'local' ? '../docs/novaventa.ts' : '../docs/novaventa.js'

    const pathFile = path.join(__dirname, fileToRead);
    const fileContent = fs.readFileSync( pathFile, 'utf-8');
    const arrayInitIndex = fileContent.indexOf("[",  fileContent.indexOf('campaing: ') );
    const arrayEndIndex = fileContent.indexOf("]", fileContent.indexOf('campaing: ') )

    const arrayContent = fileContent.slice(arrayInitIndex, arrayEndIndex + 1);
    const arrayCampaing = JSON.parse(arrayContent);
    
    const uniqueSet = new Set(arrayCampaing);
    if(!uniqueSet.has(newCampaing)){
      arrayCampaing.push(newCampaing);
    };
    if (arrayCampaing.length >= 4) arrayCampaing.shift();
    const newArrayString = arrayCampaing.map((el:number) => `"${el}"`).join(', ');

    const firstPartContent = fileContent.slice(0, arrayInitIndex)
    const endPartContent = fileContent.slice(arrayEndIndex + 1)
    const newContent = `${firstPartContent}[ ${newArrayString} ]${endPartContent}`;
    console.log('newContent: ', newContent);
    fs.writeFileSync(pathFile, newContent, 'utf8');

    return arrayCampaing;
  };

  static async validateNewCampaing(fileName = "REPORTE GENERAL DE OPERACION") {
    const lastCampaing = requestData.body.campaings[requestData.body.campaings.length - 1];
    
    const lastYear = lastCampaing.substring(0, 4);
    const nowYear = new Date().getFullYear().toString();
    
    let campaingValidate: number;
    if (lastYear === nowYear) {
      campaingValidate = Number(lastCampaing) + 1;
    } else {
      campaingValidate = Number(`${nowYear}${"01"}`);
      this.updateListCampaingModel(String(campaingValidate));
      console.log('Feliz año nuevo: ', campaingValidate);
    }

    const { login, password } = requestData.body;
    let isPageForm = false;
    
    console.log('[INFO]validate new campaing: ', campaingValidate);

    // eliminamos archivos
    const filePath1 = path.join(__dirname, "../../temp/validate", `${fileName}.xls`);
    const filePath2 = path.join(__dirname, "../../temp/validate", `${fileName.replace(" ", "-")}.xlsx`);
    if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);
    if(fs.existsSync(filePath2)) fs.unlinkSync(filePath2);

    try {
      const browser = await puppeteer.launch({ 
        headless: this.headless, // la recomendacion es tenerlo en "new"
        args: ['--no-sandbox'],
      }); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false

      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, '../../temp/validate')
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      console.log(`abrimos pagina web`);

      // Habilitamos la interceptación de solicitudes
      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        if (
          interceptedRequest.resourceType() === 'stylesheet' ||
          interceptedRequest.resourceType() === 'image' ||
          interceptedRequest.resourceType() === 'font'
        ) {
          interceptedRequest.abort();
        } else {
          interceptedRequest.continue();
        }
      });

      // escuchando evento de descarga
      page.on( 'response', (response) => this.validateDownloadExcel(response, browser, fileName, String(campaingValidate)) );
      page.on( 'load', () => {
        if (isPageForm) {
          console.log('[SUCCESS]Cerramos browser, porque la pagina cargo despues de ingresar al formulario');
          browser.close();
        } else {
          console.log('cargo la pagina antes de ingresar al formulario')
        }
      })

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      console.log('ingresando al dashboard');
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();
      console.log('ingresando a reportes')

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();
      console.log('ingresando a generar reporte')

      const formReporter = await page.waitForSelector('#SqlFields');
      console.log('formulario detectado y registrando');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", "96673");
      await page.type("#param4", String(campaingValidate));

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      isPageForm = true;
      console.log('Esperando descarga de archivo');
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };

  static async getCampaingsNovaventaModel(campaing:string, fileName:string) {
    console.log('scrapping with campaing: ', campaing);
    const { login, password } = requestData.body;

    // eliminamos archivos
    const filePath1 = path.join(__dirname, "../../temp", `${fileName}.xls`);
    const filePath2 = path.join(__dirname, "../../temp", `${fileName.replace(" ", "-")}.xlsx`);
    if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);
    if(fs.existsSync(filePath2)) fs.unlinkSync(filePath2);

    try {
      const browser = await puppeteer.launch({ 
        headless: this.headless, // la recomendacion es tenerlo en "new"
        args: ['--no-sandbox'],
      }); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false

      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, '../../temp')
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      console.log(`abrimos pagina web`);

      // Habilitamos la interceptación de solicitudes
      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        if (
          interceptedRequest.resourceType() === 'stylesheet' ||
          interceptedRequest.resourceType() === 'image' ||
          interceptedRequest.resourceType() === 'font'
        ) {
          interceptedRequest.abort();
        } else {
          interceptedRequest.continue();
        }
      });
      // escuchando evento de descarga
      page.on( 'response', (response) => this.downloadExcel( response, browser, fileName ));

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      console.log('ingresando al dashboard');
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();
      console.log('ingresando a reportes')

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();
      console.log('ingresando a generar reporte')

      const formReporter = await page.waitForSelector('#SqlFields');
      console.log('formulario detectado y registrando');
      
      await page.type("#param2", "novaventa");
      await page.select("#param3", "96673");
      await page.type("#param4", campaing);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      console.log('Esperando descarga de archivo');
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };

  static async caliCampaingsNovaventaModel(campaing:string, fileName:string) {
    console.log('scrapping with cali: ', campaing);
    const { login, password } = requestData.body;

    // eliminamos archivos
    const filePath1 = path.join(__dirname, "../../temp", `${fileName}.xls`);
    const filePath2 = path.join(__dirname, "../../temp", `${fileName.replace(" ", "-")}.xlsx`);
    if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);
    if(fs.existsSync(filePath2)) fs.unlinkSync(filePath2);

    try {
      const browser = await puppeteer.launch({ 
        headless: this.headless, // la recomendacion es tenerlo en "new"
        args: ['--no-sandbox'],
      }); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false

      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, '../../temp')
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      console.log(`abrimos pagina web`);

      // Habilitamos la interceptación de solicitudes
      await page.setRequestInterception(true);
      page.on('request', (interceptedRequest) => {
        if (
          interceptedRequest.resourceType() === 'stylesheet' ||
          interceptedRequest.resourceType() === 'image' ||
          interceptedRequest.resourceType() === 'font'
        ) {
          interceptedRequest.abort();
        } else {
          interceptedRequest.continue();
        }
      });
      // escuchando evento de descarga
      page.on( 'response', (response) => this.downloadExcel( response, browser, fileName ));

      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      console.log('ingresando al dashboard');
  
      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();
      console.log('ingresando a reportes');

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(13) a');
      await buttonRedirecOperation?.click();
      console.log('ingresando a generar reporte');

      const formReporter = await page.waitForSelector('#SqlFields');
      console.log('formulario detectado y registrando');

      await page.type("#param2", "novaventa");
      await page.select("#param3", "96673");
      await page.type("#param4", campaing);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      console.log('Esperando descarga de archivo');
    } catch (error) {
      throw new Error(`no se termino el scrapping por el error: ${error}`);
    }
  };

  static async validateExcelPath (filePath:string) {
    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        if (fs.existsSync(filePath)) {
          clearInterval(intervalo);
          resolve("Archivo encontrado");
        } else {
          console.log('esperando archivo');
        }
      }, 300 );
    })
  };

  static async downloadExcel( response: HTTPResponse, browser: Browser, fileName:string) {

    const contentDisposition = response.headers()['content-disposition'];

    if ( contentDisposition && contentDisposition.startsWith('attachment') ) {
      const filename = contentDisposition.split("filename=")[1].trim(); 
      if (filename == `${fileName}.xls`) {
        console.log('nombre archivo', filename);
        console.log('archivo creado y cerrando navegador');

        await this.validateExcelPath(path.join(__dirname, "../../temp", `${fileName}.xls`))

        console.log('browser cerrado con exito');
        browser.close();
        
        setTimeout(() => {
          console.log('leyendo archivo');
          this.updateReportDB(fileName);
        }, 3000);
      }
    };
  };

  static async updateReportDB(fileName:string, res?: Response) {
    try {
      const filePath = path.join( __dirname, '../../temp', `${fileName}.xls` );
      const newFilePath = path.join( __dirname, '../../temp', `${fileName.replace(" ", "-")}.xlsx` );
      
      const buffer = fs.readFileSync(filePath);
      const ArrayExcel = await Excel.ExcelToArray( buffer, "xls", 1, 2, filePath, newFilePath );
      console.log('excel convertido en array');

      if (Array.isArray(ArrayExcel) && ArrayExcel.every(item => typeof item === 'object') ) {
        console.log('iniciamos insert');
        const insertUpdateData = await TBPEDIDOSNOVAVENTAModel.insertOrUpdateTBPEDIDOSNOVAVENTA( 
          'TB_PEDIDOS_NOVAVENTA', ArrayExcel, 'Numero_Boleta', [ 'Ciudad', 'Seccion', 'Zona' ]
        );
        if(res){
          return res.status(200).json({ data: insertUpdateData });
        }
        // eliminamos archivos
        const filePath1 = path.join(__dirname, "../../temp", `${fileName}.xls`);
        const filePath2 = path.join(__dirname, "../../temp", `${fileName.replace(" ", "-")}.xlsx`);
        
        //! elimina los archivos
        if(fs.existsSync(filePath1)){
          fs.unlinkSync(filePath1);
          console.log('archivo 1 eliminado');
        }
        if(fs.existsSync(filePath2)){
          fs.unlinkSync(filePath2);
          console.log('archivo 2 eliminado');
        }
        console.log(`termino el proceso de insert a las ${Date.now()}`);
        return 
      }

      if (res) {
        return res.status(400).json({message: "algo fallo mira consola"})
      }
    } catch (error) {
      console.log('error: ', error);
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      if (res) {
        return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
      }
    }
  };

  static async validateDownloadExcel(response: HTTPResponse, browser: Browser, fileName:string, newCampaing:string) {
    const contentDisposition = response.headers()['content-disposition'];
    
    if ( contentDisposition && contentDisposition.startsWith('attachment')) {
      const filename = contentDisposition.split("filename=")[1].trim(); 
      console.log('filename download: ', filename);
      
      if (filename.includes('.xls')) {
        await this.validateExcelPath(path.join(__dirname, "../../temp/validate", `${fileName}.xls`));
        browser.close();

        setTimeout(() => {
          // eliminamos archivos
          const filePath1 = path.join(__dirname, "../../temp/validate", `${fileName}.xls`);
          if(fs.existsSync(filePath1)) fs.unlinkSync(filePath1);

          this.updateListCampaingModel(newCampaing)

        }, 3000)
      }
    }
  };

  static async insertOrUpdateTBPEDIDOSNOVAVENTA( table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [] ) {
    const excludeFieldsEControl = [...excludeFields, "Nombre_Plataforma"];
    console.log('excludeFieldsEControl: ', excludeFieldsEControl);
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFieldsEControl );

    const excludeFieldsCristian = [...excludeFields, "Estado_ans", "Fecha_promesa2", "Estado_promesa" ];
    console.log('excludeFieldsCristian: ', excludeFieldsCristian);
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian } };
  };
















  static async getAllTBPEDIDOSNOVAVENTA( table: string, offset:number, limit:number, orderBy:string, sort:string ) {
    return await SqlCrud.getTable( table, offset, limit, orderBy, sort );
  };

  static async countTBPEDIDOSNOVAVENTA( table:string, attribute?: string, value?: string | number ) {
    return await SqlCrud.countRows( table, attribute, value );
  };

  static async getTBPEDIDOSNOVAVENTAById( table:string, attribute: string, value: string | number ) {
    return await SqlCrud.getRowByAttribute( table, attribute, value );
  };

  static async postTBPEDIDOSNOVAVENTA( table:string, data:{} ): Promise<{ message: string; data?: SQLResponse }> {
    const res: SQLResponse = await SqlCrud.insertToObject( table, data );
    
    if(res.affectedRows == 0){
      return { message: "los datos no se pudieron ingresar correctamente" };
    }
    return { message: "Datos ingresados correctamente", data: res };

  };

  static async bulkTBPEDIDOSNOVAVENTA( table:string, bulkDataInsert: {}[] ) {
    const res: SQLResponse = await SqlCrud.insertBulk( table, bulkDataInsert );

    return { message: "Datos ingresados correctamente", data: res };
  };



  static async putTBPEDIDOSNOVAVENTA( table:string, attribute:string, data:{}, idcompanys: string ): Promise<{ message: string; data?: SQLResponse }> {
    const res: SQLResponse = await SqlCrud.updateRow( table, attribute, idcompanys, data );

    if(res.affectedRows == 0){
      return { message: "los datos no se pudieron actualizar correctamente" };
    }
    
    const dataUpddate = await SqlCrud.getRowByAttribute( table, attribute, idcompanys );

    return { message: "datos actualizados con exito", data: dataUpddate }
  };

  static async patchTBPEDIDOSNOVAVENTA( table:string, attribute:string, data:{}, idcompanys: string ): Promise<{ message: string; data?: SQLResponse }> {
    const res: SQLResponse = await SqlCrud.updateRow( table, attribute, idcompanys, data );

    if(res.affectedRows == 0){
      return { message: "los datos no se pudieron actualizar correctamente" };
    }
    
    const dataUpddate = await SqlCrud.getRowByAttribute( table, attribute, idcompanys );

    return { message: "datos actualizados con exito", data: dataUpddate }
  };

  static async deleteTBPEDIDOSNOVAVENTA( table:string, attribute:string, value: string | number ){
    const res: SQLResponse =  await SqlCrud.deleteRowTable( table, attribute, value );

    if(res.affectedRows == 0){
      return { message: "No se pudo eliminar la fila correctamente" };
    }

    return { message: `${attribute}: ${value}, eliminado con éxito de la tabla: ${table}` }
  };
}

export default TBPEDIDOSNOVAVENTAModel;
