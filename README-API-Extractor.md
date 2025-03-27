# API Extractor for MOEX Data Parsing

This project uses Microsoft's API Extractor to create clean TypeScript declaration files and track the public API surface for the MOEX (Moscow Exchange) API client library.

## What is API Extractor?

API Extractor is a tool from Microsoft that helps manage the public API surface of TypeScript libraries by:

- Generating clean API documentation
- Creating .d.ts rollup files
- Tracking API changes over time
- Enforcing API standards

## Setup in this Project

We've set up API Extractor with:

1. Configuration files in `api-extractor-configs/`
2. API reports stored in `api-extractor-configs/reports/`
3. Custom TypeScript configuration in `tsconfig.moex.json`
4. NPM scripts for building types and running API Extractor

## Usage

```bash
# Build TypeScript declaration files
npm run build:types

# Run API Extractor (local development)
npm run api-extract

# Run API Extractor (CI - stricter checks)
npm run api-extract:ci
```

## Implementing for MOEX Data

We're using API Extractor specifically for our MOEX API client library to ensure:

1. Consistent type definitions for MOEX data structures
2. Clean documentation for all public API functions
3. Stable interface for Convex integration
4. Tracking changes to the API over time

See `lib/moex-api/api-extractor-implementation.md` for detailed implementation steps.

## References

- [API Extractor Documentation](https://api-extractor.com/)
- [Moscow Exchange API Documentation](https://iss.moex.com/iss/reference/)
- [Convex Documentation](https://docs.convex.dev/) 