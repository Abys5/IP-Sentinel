import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@abuse-sleuth/prisma";

import { requiredTeamRole } from "../../../middlewares/requiredTeamRole";
import { requireLoggedInProcedure } from "../../../procedures/requireLoggedInProcedure";

export const demoteMemberController = requireLoggedInProcedure
    .use(requiredTeamRole(["MANAGER", "OWNER"]))
    .input(
        z.object({
            teamId: z.string(),
            userEmail: z.string().email(),
        })
    )
    .mutation(async (opts) => {
        // Check if User Exists
        const user = await prisma.user.findUnique({
            where: {
                email: opts.input.userEmail,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User Email doesn't exist",
            });
        }

        const userOnTeam = await prisma.userOnTeam.findUnique({
            where: {
                userId_teamId: {
                    teamId: opts.input.teamId,
                    userId: user.id,
                },
            },
        });

        if (!userOnTeam) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User Email doesn't exist",
            });
        }

        if (userOnTeam.role === "USER") {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "User on Team is Already a Manager",
            });
        }

        return await prisma.userOnTeam.update({
            where: {
                userId_teamId: {
                    teamId: opts.input.teamId,
                    userId: user.id,
                },
            },
            data: {
                role: "USER",
            },
        });
    });

export default demoteMemberController;
