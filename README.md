# Pioneer Restaurant Finder

An AI-assisted restaurant finder that turns natural language queries ("Find me a cheap sushi restaurant in downtown Los Angeles that's open now and has at least a 4-star rating") into structured Foursquare Places API requests using Google Gemini.

## Overview

Flow:

1. User sends a natural language `message` to `GET /api/execute` with an `code` (auth) query param.
2. Gemini parses the message into Foursquare search parameters.
3. Foursquare Places API is queried.
4. JSON list of simplified place objects is returned.

A root health endpoint at `/` returns runtime info.

## Prerequisites

Install these before getting started:

- [Node.js 18+](https://nodejs.org/) (This project uses ExpressJS)
- API Keys:

  - Google Gemini API Key – get from [Google AI Studio](https://aistudio.google.com/api-keys)
  - Foursquare API Key – get from Foursquare Developer Console
  - `AUTH_CODE` – create a custom secret used for simple query auth

- This repo currently uses `npm` / Node via `nodemon` + `tsx` (see `package.json`).

## Installation

Clone and install dependencies:

- git clone https://github.com/Coconhat/pioneerdev-restaurant-finder
- cd pioneerdev-restaurant-finder
- npm install

## Environment Setup

1. Create a `.env` file in the project root.
2. Add required environment variables:

### Server Configuration

PORT=3000

## Authentication secret used by validateCode middleware

AUTH_CODE=your-code-here

## API Keys

- GEMINI_API_KEY=your-gemini-api-key-here
- FOURSQUARE_API_KEY=your-foursquare-api-key-here

## Running the App

Start the server; missing critical variables (like API keys) will trigger runtime errors when those services are used.

Development (auto-reload via nodemon):

```powershell
npm run dev
```

This executes:

```
nodemon --exec tsx src/server.ts
```

Direct run (one-off):

```powershell
npx tsx src/server.ts
```

Server starts on `PORT` (default 3000) and logs:

```
Server is running on port 3000
```

## Health Check

Endpoint: `GET /`

Example:

```powershell
curl http://localhost:3000/
```

Response sample:

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Execute Endpoint

Endpoint:

```
GET /api/execute?message=your+search&code=AUTH_CODE
```

Parameters:

- `code` (required) – must match `AUTH_CODE` from `.env`
- `message` (required) – natural language query to transform (e.g. `best coffee shops near tagaytay`)

Example request:

```powershell
curl "http://localhost:3000/api/execute?message=best+coffee+shops+near+tagaytay&code=YOUR_AUTH_CODE"
```

Successful response shape:

```json
{
  "success": true,
  "data": [
    {
      "id": "abcd123",
      "name": "Starbucks Hiraya",
      "category": "Coffee",
      "address": "123 Main St, City",
      "distance": 123,
      "lat": 67.6767,
      "lng": -21.2121
    }
  ]
}
```

### Errors

Examples:

- Missing `code`:

```json
{ "message": "A code query parameter must be provided" }
```

- Invalid `code`:

```json
{ "message": "Unauthorized" }
```

- Missing/invalid `message`:

```json
{ "status": 400, "message": "Missing required parameter: message" }
```

- Internal server error:

```json
{ "error": "Internal Server Error" }
```

## Gemini Parsing Logic

Defined in `src/services/gemini-service.ts`:

- Sends prompt instructing model to output pure JSON.
- Strips markdown fences if present.
- Retries up to 3 times on transient (503) errors.

## Foursquare Integration

Defined in `src/services/foursquare-service.ts`:

- Builds query string from parsed `parameters`.
- Adds defaults: `sort=RELEVANCE`, `limit=10` if missing.
- Maps Foursquare response to simplified place objects returned by the API.

## Middleware

- `validateCode` (`src/middleware/auth-middleware.ts`) ensures `code` matches `AUTH_CODE`.
- `validateMessage` (`src/middleware/validation-middleware.ts`) ensures `message` exists and is a non-empty string.
