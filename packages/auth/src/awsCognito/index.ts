import {
    AuthenticationDetails,
    CognitoRefreshToken,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import dotENV from "dotenv";
import jwt from "jsonwebtoken";
import jwtToPem from "jwk-to-pem";
import path from "path";

import { prisma, User } from "@abuse-sleuth/prisma";

import { AuthTokens, AuthProvider } from "../AuthProvider";

const ENVPATH = path.resolve(__dirname, "../../../", ".env");
const env = dotENV.config({ path: ENVPATH });

const poolData: ICognitoUserPoolData = {
    UserPoolId: process.env["AUTH_USER_POOL_ID"] ?? "",
    ClientId: process.env["AUTH_USER_POOL_CLIENT_ID"] ?? "",
};

const userPool = new CognitoUserPool(poolData);

const getUserByID = (id: string): Promise<User> => {
    return new Promise(async (success, reject) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    idpID: id,
                },
            });
            if (user === null) {
                return reject("User doesn't exist!");
            } else {
                return success(user);
            }
        } catch (error) {
            return reject(error);
        }
    });
};

const registerUser = async (email: string, password: string): Promise<void> => {
    return new Promise((success, reject) => {
        const attributeList = [];
        attributeList.push(
            new CognitoUserAttribute({ Name: "email", Value: email })
        );

        userPool.signUp(
            email,
            password,
            attributeList,
            [],
            async (err, result) => {
                if (err) {
                    return reject(err);
                }
                await prisma.user.create({
                    data: {
                        idpID: result?.userSub ?? "",
                        email,
                    },
                });
                return success();
            }
        );
    });
};

const loginUser = async (
    email: string,
    password: string
): Promise<AuthTokens> => {
    return new Promise((success, reject) => {
        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
        });

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (results) => {
                return success({
                    accessToken: results.getAccessToken().getJwtToken(),
                    refreshToken: results.getRefreshToken().getToken(),
                });
            },
            onFailure: (err) => {
                return reject(err);
            },
        });
    });
};

const confirmRegistration = (code: string, email: string): Promise<boolean> => {
    return new Promise((success, reject) => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: userPool,
        });

        cognitoUser.confirmRegistration(code, false, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                return success(true);
            }
        });
    });
};

const verifyToken = async (accessToken: string): Promise<boolean> => {
    // TODO: Add ENV for Region.
    const res = await fetch(
        `https://cognito-idp.${"eu-west-2"}.amazonaws.com/${userPool.getUserPoolId()}/.well-known/jwks.json`
    );

    const json = (await res.json()) as { keys: Array<any> };

    let pems: any = {};
    for (let i = 0; i <= json["keys"].length - 1; i++) {
        const key = json["keys"][i];
        //console.log(`Key #${i}: ` + key.kid);
        const keyID = key.kid ?? "-";
        const mod = key.n;
        const expo = key.e;
        const type = key.kty;
        const jwk = { kty: type, n: mod, e: expo };
        //console.log(`JWK #${i}: ` + jwk);
        pems[keyID] = jwtToPem(jwk);
    }

    const decoded = jwt.decode(accessToken, { complete: true });
    if (!decoded) {
        return false;
    }

    const kid = decoded.header.kid ?? "";
    const pem = pems[kid];
    if (!pem) {
        return false;
    }

    const verification = await jwt.verify(accessToken, pem, {
        algorithms: ["RS256"],
    });
    if (verification) {
        return true;
    }

    return false;
};

const renewTokens = (
    accessToken: string,
    refreshToken: string
): Promise<AuthTokens> => {
    return new Promise((resolve, reject) => {
        const RefreshToken = new CognitoRefreshToken({
            RefreshToken: refreshToken,
        });

        const payload = jwt.decode(accessToken as string);
        const id = (payload as jwt.JwtPayload)["username"] as string;

        const cognitoUser = new CognitoUser({
            Username: id,
            Pool: userPool,
        });

        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) {
                return reject(err);
            } else {
                //console.debug(JSON.stringify(session, null, 4));
                return resolve({
                    accessToken: session.accessToken.jwtToken,
                    refreshToken: session.refreshToken.token,
                });
            }
        });
    });
};

export const awsCognitoAuth: AuthProvider = {
    getUserByID,
    confirmRegistration,
    registerUser,
    loginUser,
    verifyToken,
    renewTokens,
};
