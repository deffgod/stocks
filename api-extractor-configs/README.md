# API Extractor Configuration

This directory contains API Extractor configurations for our MOEX API client library. API Extractor is used to:

1. Generate API documentation
2. Validate the public API surface
3. Create .d.ts rollup files for better TypeScript integration

## Usage

To run API Extractor:

```bash
npm run build:types     # Build TypeScript declaration files
npm run api-extract     # Run API Extractor
```

## Configuration Files

- `api-extractor-base.json` - Base configuration shared by all API Extractor configs
- `moex-api-extractor.json` - Configuration for the MOEX API client

## Reports

The `reports` directory contains the API report files that track the public API surface over time.
These files should be committed to version control to track API changes. 