import { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

import puppeteer, { Browser, HTTPResponse } from "puppeteer";

import Excel from "../helpers/filesExcel";
import ApiResponses from "../helpers/apiResponse";
import { resStatus } from "../helpers/resStatus";
import TBPEDIDOSNOVAVENTAModel from "../models/TBPEDIDOSNOVAVENTA.model";

class WebScrapping {

  static async updateListCampaing(req: Request, res: Response) {
    const newCampaing = req.body.newCampaing;
    
    const data = await TBPEDIDOSNOVAVENTAModel.updateListCampaingModel(newCampaing)
    return res.json({
      msg:"success", 
      newCampaing,
      data
  }) 
  }

  static async multiCampaingsNovaventa() {
    await TBPEDIDOSNOVAVENTAModel.multiCampaingsNovaventaModel("202304");
  };

}

export default WebScrapping;
