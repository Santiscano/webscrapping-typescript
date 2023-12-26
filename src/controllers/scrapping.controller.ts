import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { rename, readFileSync } from 'node:fs';

import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";

import Excel from "../helpers/filesExcel";
import ApiResponses from "../helpers/apiResponse";
import { resStatus } from "../helpers/resStatus";
import TBPEDIDOSNOVAVENTAModel from "../models/TBPEDIDOSNOVAVENTA.model";

class WebScrapping {

  static async novaventa(req:Request, res:Response) {
    const {login, password, campaing } = req.body;

    try {
      const browser = await puppeteer.launch({ headless: false }); // headlees esconde el navegador y es lo recomendable por rendimiento, para verlo cambiarlo a false
      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow', 
        downloadPath: path.join(__dirname, '../../temp')
      }) // esta puerca linea me comio toda la tarde y es la encargada de redireccionar todas las descargas a la carpeta temp

      await page.goto('https://app.insitusales.com/');
      console.log('abrimos pagina web');

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
      
      page.on( 'response', (response) => WebScrapping.downloadExcel(response, browser, res ) ); // escuchando evento de descarga


      // login
      await page.type('input[name="login"]', login);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');
      console.log('ingresando al dashboard')

      // Esperar a que la página se cargue completamente (puedes ajustar el tiempo según tus necesidades)
      const buttonRedirectReporters = await page.waitForSelector('#reportsMenu a');
      await buttonRedirectReporters?.click();
      console.log('ingresando a reportes')

      const buttonRedirecOperation = await page.waitForSelector('#contentLink .support-channels .admin_icons li:nth-child(1) a');
      await buttonRedirecOperation?.click();
      console.log('ingresando a generar reporte')

      const formReporter = await page.waitForSelector('#SqlFields');
      console.log('formulario detectado y registrando')

      await page.type("#param2", "novaventa");
      await page.select("#param3", "96673");
      await page.type("#param4", campaing);

      const generateReportButton = await page.waitForSelector('#SqlFields tbody input[type="button"]');
      await generateReportButton?.click();
      console.log('Esperando descarga de archivo');

    } catch (error) {
      console.error('error durante el scrapping: ', error);
    }
  }

  static async downloadExcel(response: HTTPResponse, browser: Browser, res:Response ){
    const validateExcelPath = (filePath:string) => {
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
    }

    const contentDisposition = response.headers()['content-disposition'];
    
    if ( contentDisposition && contentDisposition.startsWith('attachment') ) {
      const filename = contentDisposition.split("filename=")[1].trim(); 
      if (filename.endsWith('.xls')) {
        console.log('nombre archivo', filename);
        console.log('archivo creado y cerrando navegador');

        await validateExcelPath(path.join(__dirname, "../../temp", "REPORTE GENERAL DE OPERACION.xls"))

        console.log('browser cerrado con exito');
        browser.close();
        
        setTimeout(() => {
          this.updateReportDB( res );
        }, 1000);
      }
    }
  }

  static async updateReportDB( res:Response){
    console.log('comenzara a leer el archivo');
    try {
      const filePath = path.join( __dirname, '../../temp', "REPORTE GENERAL DE OPERACION.xls" );
      const newFilePath = path.join( __dirname, '../../temp', "REPORTE-GENERAL-DE-OPERACION.xlsx" );
  
      const buffer = fs.readFileSync(filePath);
      const ArrayExcel = await Excel.ExcelToArray( buffer, "xls", 1, 2, filePath, newFilePath );
      // return res.json({ArrayExcel});

      if (Array.isArray(ArrayExcel) && ArrayExcel.every(item => typeof item === 'object') ) {
        const insertUpdateData = await TBPEDIDOSNOVAVENTAModel.insertOrUpdateTBPEDIDOSNOVAVENTA( 
          'TB_PEDIDOS_NOVAVENTA', ArrayExcel, 'Numero_Boleta'
        );
        if(res){
          return res.status(200).json({ data: insertUpdateData });
        }
        console.log('termino el proceso de insert');
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


    
  }

}

export default WebScrapping;
