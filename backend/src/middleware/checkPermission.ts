import { Request, Response, NextFunction } from "express";
import { hasPermission, Permissions } from "../utils/permissionManager";
import { OtisakLogger, logCode } from "../utils/logger/otisakLogger";
import { log } from "console";
import { LOG_CODE_LIBRARY } from "../utils/logger/logDefinitions";

/**
 * Middleware to check permissions
 * @param resource - The resource for which permission is being checked
 * @param action - The action being performed on the resource
 * @param fetchData - Optional function to fetch data for permission check
 */
export function checkPermission<Resource extends keyof Permissions>(
  resource: Resource,
  action: Permissions[Resource]["action"],
  fetchData?: (req: Request) => Promise<Permissions[Resource]["dataType"]>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      logCode(LOG_CODE_LIBRARY.ERROR_UNAUTHORIZED, { req, resource, action });
      return;
    }

    let data: Permissions[Resource]["dataType"] | undefined;

    if (fetchData) {
      try {
        data = await fetchData(req);
      } catch (err) {
        res.status(400).json({ error: "Invalid request" });
        logCode(LOG_CODE_LIBRARY.WARN_INVALID_REQUEST, { req, resource, action });
        return;
      }
    }
    
    const isAllowed = hasPermission(user, resource, action, data);

    if (!isAllowed) {
      res.status(403).json({ error: "Forbidden" });
      logCode(LOG_CODE_LIBRARY.ERROR_FORBIDDEN, { req, resource, action });
      return;
    }

    next();
  };
}