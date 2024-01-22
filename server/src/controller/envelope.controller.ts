import { HttpStatusCodes } from "@/constants";
import {
  CreateEnvelopeInput,
  EnvelopeTitleInput,
  UpdateEnvelopeInput,
} from "@/schemas/envelope.schema";
import EnvelopeService from "@/services/envelope.service";
import { Request, Response, NextFunction } from "express";

class EnvelopeController {
  private envelopeService: EnvelopeService;

  constructor(envelopeService: EnvelopeService) {
    this.envelopeService = envelopeService;
  }

  public createEnvelope = async (
    req: Request<{}, {}, CreateEnvelopeInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const userId = res.locals.user.id;
      const envelope = await this.envelopeService.createEnvelope(body, userId);
      res.status(HttpStatusCodes.CREATED).json({
        status: "success",
        message: "envelope created successfully",
        payload: envelope,
      });
    } catch (error) {
      console.log("Create Envelope Err: ", error);
      next(error);
    }
  };

  public getUserEnvelopes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const envelopes = await this.envelopeService.getUserEnvelopes(userId);
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "success",
        payload: envelopes,
      });
    } catch (error) {
      console.log("get Envelopes Err: ", error);
      next(error);
    }
  };

  public getUserEnvelope = async (
    req: Request<EnvelopeTitleInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const envelopeTitle = req.params.title;
      const userId = res.locals.user.id;
      const envelope = await this.envelopeService.getUserEnvelope(
        envelopeTitle,
        userId
      );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "success",
        payload: envelope,
      });
    } catch (error) {
      console.log("get Envelope Err: ", error);
      next(error);
    }
  };

  public updateEnvelope = async (
    req: Request<EnvelopeTitleInput, {}, UpdateEnvelopeInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const userId = res.locals.user.id;
      const envelopeTitle = req.params.title;
      const envelope = await this.envelopeService.updateEnvelope(
        userId,
        envelopeTitle,
        body
      );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "envelope updated successfully",
        payload: envelope,
      });
    } catch (error) {
      console.log("get Envelope Err: ", error);
      next(error);
    }
  };
  public deleteEnvelope = async (
    req: Request<EnvelopeTitleInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user.id;
      const envelopeTitle = req.params.title;
      const envelopeId = await this.envelopeService.deleteEnvelope(
        userId,
        envelopeTitle
      );
      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "envelope deleted successfully",
        payload: envelopeId,
      });
    } catch (error) {
      console.log("get Envelope Err: ", error);
      next(error);
    }
  };
}

export default EnvelopeController;
