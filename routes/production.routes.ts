import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { upload } from "./user.routes";
import { BulkUploadArticle, BulkUploadDye, BulkUploadMachine, CreateArticle, CreateDye, CreateMachine, CreateShoeWeight, GetArticles, GetDyes, GetMachines, GetMyTodayShoeWeights, GetShoeWeights, ToogleArticle, ToogleDye, ToogleMachine, UpdateArticle, UpdateDye, UpdateMachine, UpdateShoeWeight, ValidateShoeWeight } from "../controllers/production.controller";

const router = express.Router()

router.route("/articles").get(isAuthenticatedUser, GetArticles)
    .post(isAuthenticatedUser, CreateArticle)
router.put("/articles/:id", isAuthenticatedUser, UpdateArticle)
router.put("/articles/:id", isAuthenticatedUser, ToogleArticle)
router.put("/articles/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadArticle)

router.route("/machines").get(isAuthenticatedUser, GetMachines)
    .post(isAuthenticatedUser, CreateMachine)
router.put("/machines/:id", isAuthenticatedUser, UpdateMachine)
router.patch("/machines/:id", isAuthenticatedUser, ToogleMachine)
router.put("/machines/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadMachine)

router.route("/dyes").get(isAuthenticatedUser, GetDyes)
    .post(isAuthenticatedUser, CreateDye)
router.put("/dyes/:id", isAuthenticatedUser, UpdateDye)
router.put("/dyes/:id", isAuthenticatedUser, ToogleDye)
router.put("/dyes/upload/bulk", isAuthenticatedUser, upload.single('file'), BulkUploadDye)

router.route("/weights/me").get(isAuthenticatedUser, GetMyTodayShoeWeights)
router.route("/weights").get(isAuthenticatedUser, GetShoeWeights)
    .post(isAuthenticatedUser, upload.single('media'), CreateShoeWeight)
router.put("/weights/:id", isAuthenticatedUser, upload.none(), UpdateShoeWeight)
router.patch("/weights/validate/:id", isAuthenticatedUser, ValidateShoeWeight)

// router.route("/productions/me").get(isAuthenticatedUser, getpro)
router.route("/productions").get(isAuthenticatedUser, GetShoeWeights)
    // .post(isAuthenticatedUser, upload.single('media'),)
router.put("/productions/:id", isAuthenticatedUser, upload.none(), UpdateShoeWeight)
router.patch("/productions/validate/:id", isAuthenticatedUser, ValidateShoeWeight)

export default router