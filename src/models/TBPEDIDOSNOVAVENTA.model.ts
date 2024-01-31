import fs from 'fs';
import path from 'path';


import SqlCrud from "../helpers/sqlCrud";
import SQLResponse from "../interfaces/sql2";


class TBPEDIDOSNOVAVENTAModel {

  static async updateListCampaingModel(newCampaing:string) {

    const pathFile = path.join(__dirname, '../index.ts');
    const fileContent = fs.readFileSync( pathFile, 'utf-8');
    const arrayInitIndex = fileContent.indexOf("[",  fileContent.indexOf('campaing: ') );
    const arrayEndIndex = fileContent.indexOf("]", fileContent.indexOf('campaing: ') )

    const arrayContent = fileContent.slice(arrayInitIndex, arrayEndIndex + 1);
    const arrayCampaing = JSON.parse(arrayContent);
    
    const uniqueSet = new Set(arrayCampaing);
    if(!uniqueSet.has(newCampaing)){
      arrayCampaing.push(newCampaing);
    }
    if (arrayCampaing.length > 4) arrayCampaing.shift();
    const newArrayString = arrayCampaing.map((el:number) => `"${el}"`).join(', ');

    const firstPartContent = fileContent.slice(0, arrayInitIndex)
    const endPartContent = fileContent.slice(arrayEndIndex + 1)
    const newContent = `${firstPartContent}[ ${newArrayString} ]${endPartContent}`;
    console.log('newContent: ', newContent);
    fs.writeFileSync(pathFile, newContent, 'utf8');

    return arrayCampaing;
  }

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
    console.log('excludeFields: ', excludeFields);

    const excludeFieldsCristian = [...excludeFields, "Estado_ans", "Fecha_promesa2", "Estado_promesa" ]
    console.log('excludeFieldsCristian: ', excludeFieldsCristian);
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
