import * as z from "zod";

export const UserModel = z.object({
    id: z.string(),
});
