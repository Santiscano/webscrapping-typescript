import SqlCrud from "../helpers/sqlCrud";
import SQLResponse from "../interfaces/sql2";


class TBPEDIDOSNOVAVENTAModel {

  static async getAllTBPEDIDOSNOVAVENTA( table: string, offset:number, limit:number, orderBy:string, sort:string ) {
    return await SqlCrud.getTable( table, offset, limit, orderBy, sort );
  }

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

  static async insertOrUpdateTBPEDIDOSNOVAVENTA( table:string, bulkDataIsert: Record<string, any>[] , uniquekey:string, excludeFields: string[] = [] ) {
    const res: SQLResponse = await SqlCrud.insertOrUpdateBulk( table, bulkDataIsert, uniquekey, excludeFields );

    const excludeFieldsCristian = [...excludeFields, "Estado_ans", "Fecha_promesa2", "Estado_promesa" ]
    const resCristian: SQLResponse = await SqlCrud.insertOrUpdateBulkCristianDB( table, bulkDataIsert, uniquekey, excludeFieldsCristian );

    return { message: "Datos ingresados y actualizados correctamente", data: { res, resCristian } };
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
