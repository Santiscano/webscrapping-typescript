import { Request, Response } from "express";
import TBPEDIDOSNOVAVENTAModel from "../models/TBPEDIDOSNOVAVENTA.model";

import { resStatus } from "../helpers/resStatus";
import ApiResponses from "../helpers/apiResponse";
import MissingData from "../helpers/missingData";

import { TypeTBPEDIDOSNOVAVENTA } from '../interfaces/TBPEDIDOSNOVAVENTA';

class TBPEDIDOSNOVAVENTAController {
  static table: string = "TB_PEDIDOS_NOVAVENTA";
  static pktable: string = "id";

  // GET ALL ITEMS
  static async getAllTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'trae tod@s l@s TBPEDIDOSNOVAVENTA segun parametros' */
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 50;
    const offset = (page - 1) * limit || 0;
    const orderBy = req.params.orderby || TBPEDIDOSNOVAVENTAController.pktable;
    const sort = req.params.sort || 'ASC';
    
    try {
      const allData = await TBPEDIDOSNOVAVENTAModel.getAllTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, offset, limit, orderBy, sort  );
      /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTARes' }} */
      return res.status(resStatus.success).json(ApiResponses.success(allData));
    } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // COUNT ALL ITEMS
  static async countTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'cuenta tod@s l@s TBPEDIDOSNOVAVENTA' */
    try {
      const count = await TBPEDIDOSNOVAVENTAModel.countTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table );
      return count
        ? res.status(resStatus.success).json(ApiResponses.success( count, "cantidad recuperada" ))
        : res.status(resStatus.noContent).json(ApiResponses.errorMessage( "datos no encontrados" ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/countSuccess' }} */
        /* #swagger.responses[400] = { description: 'noContent', schema: { $ref: '#/definitions/errorMessage' }} */
    } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // GET ITEM BY ID
  static async getTBPEDIDOSNOVAVENTAById(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'trae el/la TBPEDIDOSNOVAVENTA segun id' */
    /*  #swagger.parameters['id'] = { description: 'id de TBPEDIDOSNOVAVENTA a buscar' } */
    try {
      const dataById = await TBPEDIDOSNOVAVENTAModel.getTBPEDIDOSNOVAVENTAById( TBPEDIDOSNOVAVENTAController.table, TBPEDIDOSNOVAVENTAController.pktable, req.params.id );
      return dataById.data
        ? res.status(resStatus.success).json(ApiResponses.success( dataById.data, dataById.message ))
        : res.status(resStatus.noContent).json(ApiResponses.errorMessage( dataById.message! ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TB_PEDIDOS_NOVAVENTARes' }} */
        /* #swagger.responses[400] = { description: 'noContent', schema: { $ref: '#/definitions/errorMessage' }} */
    } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // CREATE ITEM
  static async postTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'crea un nuevo TBPEDIDOSNOVAVENTA segun el body' */
    /*  #swagger.parameters['body'] = { in: 'body', description: 'datos para crear un@ TBPEDIDOSNOVAVENTA', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTA' }} */
    const { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido } = req.body;
    const validate: TypeTBPEDIDOSNOVAVENTA = { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido };
    const data: TypeTBPEDIDOSNOVAVENTA = { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido };
    
    try {
      const missing = MissingData.missingData(validate);
      if(missing.error) return res.status(resStatus.unCompleted).json(ApiResponses.uncompleted(missing.missing));
      
      const postData = await TBPEDIDOSNOVAVENTAModel.postTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, data );
      const idData = postData.data.insertId
      return postData.data
        ? res.status(resStatus.success).json( ApiResponses.success({ idData, ...data }, postData.message ))
        : res.status(resStatus.unCompleted).json( ApiResponses.errorMessage( postData.message ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTARes' }} */
        /* #swagger.responses[400] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
        /* #swagger.responses[422] = { description: 'UnCompleted', schema: { $ref: '#/definitions/uncompleted' }} */
    } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // CREATE BULK ITEMS
  static async bulkTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'crea uno o muchos TBPEDIDOSNOVAVENTA segun el body' */
    /*  #swagger.parameters['body'] = { in: 'body', description: 'datos para crear uno o muchos TBPEDIDOSNOVAVENTA', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTA' }} */
    const { bulkDataInsert } = req.body;

    try {
      const missing = MissingData.missingDataBulk( bulkDataInsert );
      if(missing.error) return res.status(resStatus.unCompleted).json(ApiResponses.uncompleted( missing.missing ))

      const bulkData = await TBPEDIDOSNOVAVENTAModel.bulkTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, bulkDataInsert );
      return bulkData.data
        ? res.status(resStatus.success).json(ApiResponses.success(bulkData.data, bulkData.message))
        : res.status(resStatus.unCompleted).json(ApiResponses.errorMessage( bulkData.message ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/bulkSuccess' }} */
        /* #swagger.responses[400] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
        /* #swagger.responses[422] = { description: 'UnCompleted', schema: { $ref: '#/definitions/uncompleted' }} */
      } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  }

  // UPDATE ITEM
  static async putTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'actualiza toda la informacion de un TBPEDIDOSNOVAVENTA segun body' */
    /*  #swagger.parameters['id'] = { description: 'id de TBPEDIDOSNOVAVENTA a modificar' } */
    /*  #swagger.parameters['body'] = { in: 'body', description: 'todos los datos necesarios para modificar un@ TBPEDIDOSNOVAVENTA', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTA' }} */
    const { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido } = req.body;
    const id = req.params.id;
    const data: TypeTBPEDIDOSNOVAVENTA = { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido };
    
    try {
      const missing = MissingData.missingData({...data, id });
      if(missing.error) return res.status(resStatus.unCompleted).json(ApiResponses.uncompleted(missing.missing));

      const putData = await TBPEDIDOSNOVAVENTAModel.putTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, TBPEDIDOSNOVAVENTAController.pktable, data, id );
      return putData.data
        ? res.status(resStatus.success).json(ApiResponses.success( putData.data, putData.message ))
        : res.status(resStatus.unCompleted).json(ApiResponses.errorMessage( putData.message ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTARes' }} */
        /* #swagger.responses[400] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
        /* #swagger.responses[422] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
      } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // UPDATE ITEM
  static async patchTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'actualiza la informacion de un TBPEDIDOSNOVAVENTA segun lo que reciba en el body' */
    /*  #swagger.parameters['id'] = { description: 'id de TBPEDIDOSNOVAVENTA a modificar' } */
    /*  #swagger.parameters['body'] = { in: 'body', description: 'todos los datos posibles para modificar un@ TBPEDIDOSNOVAVENTA', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTA' }} */
    const { Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido } = req.body;
    const id = req.params.id;
    const data = MissingData.notEmptyToObjet({ Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido });

    try {
      const missing = MissingData.missingData({ id });
      if(missing.error) return res.status(resStatus.unCompleted).json(ApiResponses.uncompleted(missing.missing));

      const patchData = await TBPEDIDOSNOVAVENTAModel.patchTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, TBPEDIDOSNOVAVENTAController.pktable, data, id );
      return patchData.data
        ? res.status(resStatus.success).json(ApiResponses.success( patchData.data, patchData.message ))
        : res.status(resStatus.unCompleted).json(ApiResponses.errorMessage( patchData.message ))
        /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTARes' }} */
        /* #swagger.responses[400] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
        /* #swagger.responses[422] = { description: 'UnCompleted', schema: { $ref: '#/definitions/errorMessage' }} */
      } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

  // DELETE ITEM
  static async deleteTBPEDIDOSNOVAVENTA(req: Request, res: Response) {
    /* #swagger.tags = ['TBPEDIDOSNOVAVENTA'] #swagger.description = 'elimina el/la TBPEDIDOSNOVAVENTA con el id que llega por parametros' */
    /*  #swagger.parameters['id'] = { description: 'id de TBPEDIDOSNOVAVENTA a eliminar' } */
    try {
      const dataById = await TBPEDIDOSNOVAVENTAModel.deleteTBPEDIDOSNOVAVENTA( TBPEDIDOSNOVAVENTAController.table, TBPEDIDOSNOVAVENTAController.pktable, req.params.id );
      /* #swagger.responses[200] = { description: 'Response success', schema: { $ref: '#/definitions/TBPEDIDOSNOVAVENTARes' }} */
      return res.status(resStatus.success).json(ApiResponses.success( null, dataById.message ))
    } catch (error) {
      /* #swagger.responses[500] = { description: 'Error server', schema: { $ref: '#/definitions/unsuccessfully' }} */
      return res.status(resStatus.serverError).json(ApiResponses.unsuccessfully( error ));
    }
  };

};

export default TBPEDIDOSNOVAVENTAController;
