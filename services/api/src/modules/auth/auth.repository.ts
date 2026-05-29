import type { Prisma, PrismaClient } from "@prisma/client";

const userSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  avatarUrl: true,
  status: true,
} satisfies Prisma.UserSelect;

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  status: true,
} satisfies Prisma.UserSelect;

const defaultOnboardingSteps = [
  { stepKey: "business_profile", title: "Business profile" },
  { stepKey: "business_goal", title: "Business goal" },
  { stepKey: "menu_upload", title: "Menu upload" },
  { stepKey: "opening_hours", title: "Opening hours" },
  { stepKey: "location", title: "Location" },
  { stepKey: "faq", title: "FAQ" },
  { stepKey: "agent_persona", title: "Agent persona" },
  { stepKey: "human_handoff_rule", title: "Human handoff rule" },
  { stepKey: "whatsapp_connect", title: "WhatsApp connect" },
  { stepKey: "go_live", title: "Go live" },
] as const;

export type RegisterWorkspaceData = {
  user: {
    name: string;
    email: string;
    passwordHash: string;
  };
  business: {
    name: string;
    slug: string;
    type: "coffee_shop" | "cafe" | "restaurant" | "bakery" | "service" | "other";
  };
};

export type CreateRefreshTokenData = {
  userId: string;
  tokenHash: string;
  familyId: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
};

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: userSelect,
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  findBusinessBySlug(slug: string) {
    return this.prisma.business.findUnique({
      where: { slug },
      select: { id: true },
    });
  }

  createRegisterWorkspaceTransaction(data: RegisterWorkspaceData) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: data.user,
        select: publicUserSelect,
      });

      const business = await tx.business.create({
        data: {
          ownerId: user.id,
          name: data.business.name,
          slug: data.business.slug,
          type: data.business.type,
          status: "onboarding",
        },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          slug: true,
        },
      });

      const member = await tx.businessMember.create({
        data: {
          businessId: business.id,
          userId: user.id,
          role: "owner",
          status: "active",
        },
        select: {
          role: true,
          status: true,
        },
      });

      await tx.businessOnboarding.create({
        data: {
          businessId: business.id,
          currentStep: "business_profile",
        },
      });

      await tx.onboardingStep.createMany({
        data: defaultOnboardingSteps.map((step, index) => ({
          businessId: business.id,
          stepKey: step.stepKey,
          title: step.title,
          sortOrder: index + 1,
          status: index === 0 ? "in_progress" : "pending",
        })),
      });

      await tx.agentSettings.create({
        data: {
          businessId: business.id,
          agentName: "Ningki",
          tone: "friendly",
          language: "id",
          autoReplyEnabled: false,
          humanTakeoverEnabled: true,
          maxUnknownAttempts: 2,
        },
      });

      return {
        user,
        business,
        member,
      };
    });
  }

  updateLastLoginAt(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
      select: { id: true },
    });
  }

  createRefreshToken(data: CreateRefreshTokenData) {
    const createData: Prisma.RefreshTokenCreateInput = {
      user: { connect: { id: data.userId } },
      tokenHash: data.tokenHash,
      familyId: data.familyId,
      expiresAt: data.expiresAt,
    };

    if (data.userAgent) createData.userAgent = data.userAgent;
    if (data.ipAddress) createData.ipAddress = data.ipAddress;

    return this.prisma.refreshToken.create({
      data: createData,
      select: {
        id: true,
        familyId: true,
      },
    });
  }

  findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: publicUserSelect,
        },
      },
    });
  }

  revokeRefreshToken(id: string, replacedBy?: string) {
    const data: Prisma.RefreshTokenUpdateInput = {
      revokedAt: new Date(),
    };

    if (replacedBy) {
      data.replacedBy = replacedBy;
    }

    return this.prisma.refreshToken.update({
      where: { id },
      data,
      select: { id: true },
    });
  }

  revokeRefreshTokenFamily(familyId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  revokeAllUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  findCurrentBusinessForUser(userId: string) {
    return this.prisma.businessMember.findFirst({
      where: {
        userId,
        status: "active",
        business: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        role: true,
        status: true,
        business: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            slug: true,
          },
        },
      },
    });
  }
}
