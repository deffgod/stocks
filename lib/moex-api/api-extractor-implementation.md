# Implementing API Extractor for MOEX Data Parsing

This document outlines the steps to implement Microsoft API Extractor for the MOEX API client library in our project.

## Overview

API Extractor helps us:
1. Generate clean API documentation
2. Track changes to our public API
3. Create optimized TypeScript declaration files
4. Enforce API design standards

## Implementation Steps

### 1. Setup (Completed)

- ✅ Install @microsoft/api-extractor and TypeScript
- ✅ Create api-extractor-configs directory with necessary configs
- ✅ Add npm scripts for building types and running API Extractor
- ✅ Create TypeScript configuration for MOEX API (tsconfig.moex.json)

### 2. Code Organization (To Do)

The current codebase has TypeScript errors that need to be fixed. Here's the plan:

- [ ] Fix import paths to ensure proper type resolution
- [ ] Update MOEXBaseResponse interface in types/moex-api.ts
- [ ] Fix type imports in fetchSecurities.ts and other files
- [ ] Ensure all public APIs have proper JSDoc comments
- [ ] Mark internal functions with @internal tag

### 3. Type Structure (To Do)

Organize types in a way that works well with API Extractor:

- [ ] Create a dedicated types directory for the MOEX API
- [ ] Separate public and internal types
- [ ] Define clear interfaces for all data structures
- [ ] Use namespaces for related types if needed

### 4. Running API Extractor (To Do)

After fixing code issues:

1. Run the build:types script to generate .d.ts files
2. Run api-extract script to generate API reports
3. Commit the reports to track API changes
4. Use the generated .d.ts rollup for public consumption

### 5. Integration with Convex (To Do)

Connect the API Extractor types with the Convex backend:

- [ ] Import types from generated declarations in Convex functions
- [ ] Update schema definitions to match API types
- [ ] Create adapters between API and database models

## API Structure

The MOEX API client should expose these core functions:

```typescript
// Core API
fetchMOEX(endpoint, params): Promise<MOEXBaseResponse>
postMOEX(endpoint, body, options): Promise<MOEXBaseResponse>

// Securities API
fetchSecurities(filters, start, limit): Promise<MOEXSecurity[]>
fetchSecuritiesFiltered(filters): Promise<MOEXSecurity[]>
fetchTrendingStocks(limit): Promise<MOEXSecurity[]>

// Market data
fetchIndexData(indexId): Promise<MOEXAnalytics[]>
fetchSectorPerformance(): Promise<MOEXSectorPerformance[]>
```

## Troubleshooting

Common issues and solutions:

1. **Missing Types**: Ensure all exported functions have proper return types
2. **Import Errors**: Check that paths use relative imports correctly
3. **JSDoc Issues**: API Extractor is strict about JSDoc format

## Resources

- [API Extractor Documentation](https://api-extractor.com/)
- [TypeScript Declaration Files Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Convex API References](https://docs.convex.dev/api) 