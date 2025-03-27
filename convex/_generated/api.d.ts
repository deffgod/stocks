/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cronActions from "../cronActions.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as moexApi from "../moexApi.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cronActions: typeof cronActions;
  crons: typeof crons;
  http: typeof http;
  moexApi: typeof moexApi;
  mutations: typeof mutations;
  queries: typeof queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
