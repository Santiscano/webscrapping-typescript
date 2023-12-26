import { Router } from "express";

import WebScrapping from "../controllers/scrapping.controller";

const route = Router();

route.post("/", WebScrapping.novaventa );
// route.post("/", WebScrapping.updateReportDB );


export default route;
