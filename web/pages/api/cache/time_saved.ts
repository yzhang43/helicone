import { getCacheCount, getTimeSaved } from "../../../lib/api/cache/stats";
import {
  HandlerWrapperOptions,
  withAuth,
} from "../../../lib/api/handlerWrappers";
import { Result } from "../../../lib/result";

async function handler({
  req,
  res,
  userData: { orgId },
}: HandlerWrapperOptions<Result<number, string>>) {
  console.log("time_saved.ts");
  res.status(200).json(await getTimeSaved(orgId, "all"));
}

export default withAuth(handler);
