import fs from 'fs';
import http from "http";
import https from "https";
import path from "path";

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import multer from 'multer';
import cors from "cors";
import bodyParser from 'body-parser';
import { Server as socketio } from 'socket.io';
import swaggerUI from 'swagger-ui-express';

import { PORT, URL, PROTOCOL, SSL_PRIVATE_KEY, SSL_CERTIFICATE } from '../config/configPorts';
// import Logs from '../middlewares/logs';
import { Protocol } from '../interfaces/server'
import { ServerInterface } from '../interfaces/server';
import { SocketEvents } from '../helpers/sockets';
import routes from "../routes";
import swaggerDocJson from '../documentation/swagger-output.json'; 

export class Server implements ServerInterface{
  private app = express(); // app es de express
  private io: any;
  private server: // server es de http o https
    http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> |  
    https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | 
    undefined;
  private protocol = PROTOCOL;
  private sockets: any;
  private upload = multer({ storage: multer.memoryStorage() })

  constructor(){}

  createServer() {
    const serverProtocol = {
      http: () => {
        return http.createServer( this.app );
      },
      https: () => {
        // RUTAS SSL
        const credentials = {
          key: fs.readFileSync(`${SSL_PRIVATE_KEY}`, 'utf8'),
          cert: fs.readFileSync(`${SSL_CERTIFICATE}`, 'utf8')
        };
        return https.createServer( credentials, this.app )
      }
    }
    return serverProtocol[this.protocol as Protocol ]();
  }

  middlewares(): void {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    // this.app.use((req:Request, res:Response, next: NextFunction) => Logs.customLogger(req, res, next, "6m"))
    this.app.use(bodyParser.urlencoded({ limit: 'Infinity', extended: true }));
    this.app.use(bodyParser.json({ limit: 'Infinity' }));
  }

  routes(): void {
    
    this.app.get('/', (req:Request, res: Response) => res.json({ msg:'bienvenido a la api, esta es tu primer ruta'}))
    
    // rutas principales por versiones
    this.app.use("/api/v1", routes);

    // documentation
    this.app.use("/docs", swaggerUI.serve, swaggerUI.setup( swaggerDocJson ));
    this.app.use("/docs.json", (req:Request, res: Response) => {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(swaggerDocJson);
    });
    
    // error ruta no existente
    this.app.use((
      req: Request, 
      res: Response, 
      next: NextFunction
    ) => {
      res.status(404).json({
        message: "endpoint not found",
      });
    })
  }

  // servir archivo frontend
  frontend(): void {
    this.app.use( express.static( path.resolve( __dirname, '../../client/dist' )))
    this.app.get( "*", (req: Request, res: Response) => {
      res.sendFile( path.join( __dirname, '../../client/dist/index.html'))
    })
  }

  // crear webSockets
  webSockets(): void {
    this.io = new socketio( this.server, /** configuracion */ )

    this.sockets = new SocketEvents( this.io );
  }


  serverOn() {
    this.server = this.createServer();
    this.middlewares();
    this.routes();
    // this.frontend();
    this.webSockets();
    
    this.server!.listen( PORT, () => {
      console.log(`Servidor escuchando en el puerto ${ PROTOCOL }${ URL }${ PORT }`)
    })
  }

}
  
