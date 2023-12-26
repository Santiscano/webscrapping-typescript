import { Router } from "express";
import TBPEDIDOSNOVAVENTAController from "../controllers/TBPEDIDOSNOVAVENTA.controller";

const route = Router();

route.get( "/", TBPEDIDOSNOVAVENTAController.getAllTBPEDIDOSNOVAVENTA );
route.get("/count", TBPEDIDOSNOVAVENTAController.countTBPEDIDOSNOVAVENTA ); 
route.get("/:id", TBPEDIDOSNOVAVENTAController.getTBPEDIDOSNOVAVENTAById );

route.post("/create", TBPEDIDOSNOVAVENTAController.postTBPEDIDOSNOVAVENTA );
route.post("/bulk", TBPEDIDOSNOVAVENTAController.bulkTBPEDIDOSNOVAVENTA );

route.put("/:id", TBPEDIDOSNOVAVENTAController.putTBPEDIDOSNOVAVENTA );
route.patch("/:id", TBPEDIDOSNOVAVENTAController.patchTBPEDIDOSNOVAVENTA );

route.delete("/:id", TBPEDIDOSNOVAVENTAController.deleteTBPEDIDOSNOVAVENTA );

export default route;
