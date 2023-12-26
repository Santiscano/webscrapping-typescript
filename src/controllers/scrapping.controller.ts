import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';
import { rename, readFileSync } from 'node:fs';

import puppeteer, { Browser, HTTPResponse, Page } from "puppeteer";

import Excel from "../helpers/filesExcel";

class WebScrapping {

  static async novaventa(req:Request, res:Response) {
    const {login, password, campaing } = req.body;

    try {
      const browser = await puppeteer.launch({ headless: 'new' }); // headlees esconde el navegador y es lo recomendable por rendimiento
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
      
      page.on( 'response', (response) => WebScrapping.downloadExcel(response, browser, page, req, res ) ); // escuchando evento de descarga


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
      console.log('generando archivo');

    } catch (error) {
      console.error('error durante el scrapping: ', error);
    }
  }

  static async downloadExcel(response: HTTPResponse, browser: Browser, page: Page, req: Request, res:Response ){
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
          this.updateReportDB(req, res);
        }, 1000);
      }
    }
  }

  static async updateReportDB(req:Request, res:Response){
    console.log('comenzara a leer el archivo');
    const filePath = path.join( __dirname, '../../temp', "REPORTE GENERAL DE OPERACION.xls" );
    const newFilePath = path.join( __dirname, '../../temp', "REPORTE-GENERAL-DE-OPERACION.xlsx" );

    const buffer = fs.readFileSync(filePath);
    const data = await Excel.ExcelToArray( buffer, "xls", 1, 2, filePath, newFilePath );

    
    
    res.status(200).json({data});
  }

}

export default WebScrapping;
