import { Envelope, Prisma, PrismaClient } from "@prisma/client";

class EnvelopeRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createEnvelope = async (
    envelopeData: Prisma.EnvelopeCreateInput
  ): Promise<Envelope> => {
    const envelope = await this.prisma.envelope.create({
      data: envelopeData,
    });
    return envelope;
  };

  getUserEnvelopes = async (
    where: Prisma.EnvelopeWhereInput,
    select?: Prisma.EnvelopeSelect
  ): Promise<Envelope[]> => {
    return this.prisma.envelope.findMany({
      where,
      select,
    });
  };

  findEnvelope = async (
    where: Prisma.EnvelopeWhereInput,
    select?: Prisma.EnvelopeSelect
  ) => {
    return (await this.prisma.envelope.findFirst({
      where,
      select,
    })) as Envelope;
  };

  findUniqueEnvelope = async (
    where: Prisma.EnvelopeWhereUniqueInput,
    select?: Prisma.EnvelopeSelect
  ) => {
    return (await this.prisma.envelope.findUnique({
      where,
      select,
    })) as Envelope;
  };

  updateEnvelope = async (
    where: Prisma.EnvelopeWhereUniqueInput,
    data: Prisma.EnvelopeUpdateInput,
    select?: Prisma.EnvelopeSelect
  ) => {
    return (await this.prisma.envelope.update({
      where,
      data,
      select,
    })) as Envelope;
  };

  deleteEnvelope = async (
    where: Prisma.EnvelopeWhereUniqueInput,
    select?: Prisma.EnvelopeSelect
  ) => {
    return (await this.prisma.envelope.delete({
      where,
      select,
    })) as Envelope;
  };
}

export default EnvelopeRepository;
