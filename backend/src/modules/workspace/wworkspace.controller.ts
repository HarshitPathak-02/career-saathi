import { Request, Response } from "express";

import { asyncHandler } from "../../core/middleware/async-handler.js";

import { successResponse } from "../../core/responses/successResponse.js";
import { getAuthUser } from "../../shared/utils/get-auth-user.js";
import { workspaceService } from "./workspace.service.js";

class WorkspaceController {

    getWorkspace = asyncHandler(
        async (req: Request, res: Response) => {
            const user = getAuthUser(req);
            const workspace =
                await workspaceService.getWorkspace(
                    user.userId
                );

            successResponse({
                res,
                statusCode: 200,
                message: "Workspace details is fetched.",
                data: workspace
            });
        }
    );
}

export const workspaceController = new WorkspaceController();