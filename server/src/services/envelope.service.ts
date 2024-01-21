import EnvelopeRepository from "@/repositories/envelopeRepository";
import { EnvelopeUpdateInputWithRequiredFields } from "@/types/envelope.interface";
import { Envelope, Prisma } from "@prisma/client";

class EnvelopeService {
  private envelopeRepository: EnvelopeRepository;
  constructor(envelopeRepository: EnvelopeRepository) {
    this.envelopeRepository = envelopeRepository;
  }

  public async createEnvelope(
    envelopeData: Prisma.EnvelopeCreateInput
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.createEnvelope(envelopeData);
    return envelope;
  }

  public async getUserEnvelopes(userId: string): Promise<Envelope[]> {
    const envelopes = await this.envelopeRepository.getUserEnvelopes(
      { userId },
      { transactions: true }
    );
    return envelopes;
  }

  public async getUserEnvelope(
    envelopeTitle: string,
    userId: string
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.findUniqueEnvelope({
      userId_title: {
        userId,
        title: envelopeTitle,
      },
    });
    return envelope;
  }

  public async updateEnvelope(
    envelopeData: EnvelopeUpdateInputWithRequiredFields
  ): Promise<Envelope> {
    const envelope = await this.envelopeRepository.updateEnvelope(
      {
        userId_title: {
          userId: envelopeData.userId,
          title: envelopeData.title,
        },
      },
      { ...envelopeData }
    );
    return envelope;
  }

  public async deleteEnvelope(
    envelopeTitle: string,
    userId: string
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
