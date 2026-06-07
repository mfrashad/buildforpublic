/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as communityProjects from "../communityProjects.js";
import type * as emails from "../emails.js";
import type * as eventRsvps from "../eventRsvps.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as ngoHelped from "../ngoHelped.js";
import type * as opportunities from "../opportunities.js";
import type * as profiles from "../profiles.js";
import type * as projectRequests from "../projectRequests.js";
import type * as seed from "../seed.js";
import type * as volunteers from "../volunteers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  communityProjects: typeof communityProjects;
  emails: typeof emails;
  eventRsvps: typeof eventRsvps;
  http: typeof http;
  members: typeof members;
  ngoHelped: typeof ngoHelped;
  opportunities: typeof opportunities;
  profiles: typeof profiles;
  projectRequests: typeof projectRequests;
  seed: typeof seed;
  volunteers: typeof volunteers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
