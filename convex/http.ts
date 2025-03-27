import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * HTTP endpoints for the MOEX API integration
 * 
 * These endpoints allow external systems to trigger data updates
 * and fetch specific data points via HTTP requests.
 */

// Create the HTTP router
const http = httpRouter();

/**
 * Validate the API key from the request
 */
const validateApiKey = (request: Request): boolean => {
  const apiKey = request.headers.get("x-api-key");
  // In a real app, you would validate against a stored API key
  // For demo purposes, we accept any non-empty string
  return !!apiKey && apiKey.length > 0;
};

/**
 * Endpoint to update futures data
 */
http.route({
  path: "/updateFutures",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Validate API key
    if (!validateApiKey(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    try {
      // Extract optional limit parameter from request body
      const body = await request.json().catch(() => ({}));
      const limit = body.limit || 100;
      
      // Call the fetchFutures action to get latest data
      const futuresResult = await ctx.runAction(internal.moexApi.fetchFutures, { 
        limit 
      });
      
      if (!futuresResult.success) {
        throw new Error(futuresResult.error);
      }
      
      // Save the data to the database
      const saveResult = await ctx.runMutation(internal.mutations.saveSecurities, {
        securities: futuresResult.data,
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Futures data updated successfully",
        stats: saveResult,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating futures:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

/**
 * Endpoint to update options data
 */
http.route({
  path: "/updateOptions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Validate API key
    if (!validateApiKey(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    try {
      // Extract optional limit parameter from request body
      const body = await request.json().catch(() => ({}));
      const limit = body.limit || 100;
      
      // Call the fetchOptions action to get latest data
      const optionsResult = await ctx.runAction(internal.moexApi.fetchOptions, { 
        limit 
      });
      
      if (!optionsResult.success) {
        throw new Error(optionsResult.error);
      }
      
      // Save the data to the database
      const saveResult = await ctx.runMutation(internal.mutations.saveSecurities, {
        securities: optionsResult.data,
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Options data updated successfully",
        stats: saveResult,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating options:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

/**
 * Endpoint to update funds flow data
 */
http.route({
  path: "/updateFundsFlow",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Validate API key
    if (!validateApiKey(request)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    try {
      // Extract optional date parameter from request body
      const body = await request.json().catch(() => ({}));
      const date = body.date || new Date().toISOString().split("T")[0];
      
      // Call the fetchFundsFlow action to get latest data
      const fundsFlowResult = await ctx.runAction(internal.moexApi.fetchFundsFlow, { 
        date 
      });
      
      if (!fundsFlowResult.success) {
        throw new Error(fundsFlowResult.error);
      }
      
      // Save the data to the database
      const saveResult = await ctx.runMutation(internal.mutations.saveFundsFlow, {
        fundsFlowData: fundsFlowResult.data,
      });
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Funds flow data updated successfully",
        stats: saveResult,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating funds flow:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

/**
 * Endpoint to get a specific security by ID
 */
http.route({
  path: "/security/:secid",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const secid = url.pathname.split("/").pop();
      
      if (!secid) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Security ID is required" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Get the security from the database
      const security = await ctx.runQuery(internal.queries.getSecurityById, { 
        secid 
      });
      
      if (!security) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Security not found" 
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: security 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error getting security:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Export the HTTP router
export default http; 