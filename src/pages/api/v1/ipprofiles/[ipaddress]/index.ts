import runMiddleware from "@libs/helpers/runMiddleware";
import checkAuthenticated from "@libs/middlewares/checkAuthenticated";
import checkMethod from "@libs/middlewares/checkMethod";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "@libs/utils/logger";
import { IPProfile } from "@prisma/client";
import joiValidation from "@libs/middlewares/joiValidation";
import Joi from "joi";
import { ipRegex } from "@libs/utils/regexTest";
import getIPProfileByIP from "@services/database/queries/ipProfiles/getIPProfileByIP";

const querySchema = Joi.object({
    ipaddress: Joi.string()
        .regex(ipRegex)
        .message("Invalid IP Address")
        .required(),
});

const handler = async (
    req: NextApiRequest & { uid: string },
    res: NextApiResponse<GenericHTTPResponse>
) => {
    await runMiddleware(req, res, checkMethod(["GET"]));
    await runMiddleware(req, res, checkAuthenticated);
    await runMiddleware(req, res, joiValidation({ query: querySchema }));

    const ipAddress: string = req.query.ipaddress as string;

    logger.info(`Getting IP Profile ${ipAddress} for ${req.uid}`);

    let ipProfile: IPProfile | null;
    try {
        ipProfile = await getIPProfileByIP(ipAddress);
    } catch (error) {
        logger.error(
            `Error getting IP Profile ${ipAddress} for ${req.uid}: `,
            error
        );
        throw error;
    }

    if (ipProfile === null) {
        logger.error(`IP Profile ${ipAddress} for ${req.uid} was null`);
        throw new Error("IP Profile was null");
    }

    res.status(200).json({ ok: true, data: ipProfile });
};

export default handler;