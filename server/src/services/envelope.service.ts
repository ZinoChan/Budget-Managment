import { HttpStatusCodes } from "@/constants";
import { HttpException } from "@/exceptions/httpException";
import EnvelopeRepository from "@/repositories/envelopeRepository";
import { CreateEnvelopeInput } from "@/schemas/envelope.schema";
import { Envelope, Prisma } from "@prisma/client";

class EnvelopeService {
  private envelopeRepository: EnvelopeRepository;
  constructor(envelopeRepository: EnvelopeRepository) {
    this.envelopeRepository = envelopeRepository;
  }

  public async createEnvelope(
    envelopeData: CreateEnvelopeInput,
    userId: string
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.createEnvelope(
      {
        ...envelopeData,
        title: envelopeData.title.toLowerCase(),
      },
      userId
    );
    return envelope;
  }

  public async getUserEnvelopes(userId: string): Promise<Envelope[]> {
    const envelopes = await this.envelopeRepository.getUserEnvelopes({
      userId,
    });
    return envelopes;
  }

  public async getUserEnvelope(
    envelopeTitle: string,
    userId: string
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.findUniqueEnvelope({
      userId_title: {
        userId,
        title: envelopeTitle.toLowerCase(),
      },
    });
    if (!envelope)
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Envelope not found");
    return envelope;
  }

  public async updateEnvelope(
    userId: string,
    title: string,
    envelopeData: Prisma.EnvelopeUpdateInput
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.updateEnvelope(
      {
        userId_title: {
          userId: userId,
          title,
        },
      },
      { ...envelopeData }
    );
    return envelope;
  }

  public async deleteEnvelope(
    userId: string,
    envelopeTitle: string
  ): Promise<string> {
    const envelope = await this.envelopeRepository.deleteEnvelope({
      userId_title: {
        userId,
        title: envelopeTitle,
      },
    });

    return envelope.id;
  }
}

export default EnvelopeService;
