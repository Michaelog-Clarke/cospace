# Error Handling Demo

Start the API in one terminal:

```sh
npm run dev
```

Use a second terminal for the following requests. Set `TOKEN` to the development token configured locally in `src/middleware/auth.ts`:

```sh
TOKEN='YOUR_DEVELOPMENT_TOKEN'
```

## 404: booking not found

```sh
curl -i http://localhost:5000/bookings/99999
```

Expected response:

```json
{
  "status": "fail",
  "message": "Booking not found"
}
```

The controller asks the booking service for the ID. If the service returns no booking, the controller raises `NotFoundError` and forwards it with `next(error)`. The global error middleware formats the 404 response.

## 400: Zod validation issues

```sh
curl -i -X POST http://localhost:5000/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"desk":"A","floor":"Floor 1","date":"2026-09-29","active":true}'
```

Expected response (`desk` is shorter than the schema's minimum):

```json
{
  "status": "fail",
  "message": "Validation failed",
  "details": [
    {
      "path": "desk",
      "message": "Desk must be at least 3 characters long"
    }
  ]
}
```

The route runs `validateSchema(createBookingSchema)`. It converts Zod's failed parse into a `BadRequestError` containing the issue list and passes the error to `next()`. The global handler returns the same outer `status` and `message` structure as other operational errors, with Zod issues in `details`.

## 401 and 403: authentication and permissions

Send an invalid token to a protected route:

```sh
curl -i -X POST http://localhost:5000/bookings \
  -H 'Authorization: Bearer invalid-token' \
  -H 'Content-Type: application/json' \
  -d '{"desk":"Desk A1","floor":"Floor 1","date":"2026-09-29","active":true}'
```

Expected response:

```json
{
  "status": "fail",
  "message": "Unauthorized"
}
```

The app currently has no role/permission check, so it has no normal request that produces 403. To simulate one, temporarily add this import to `src/index.ts`:

```ts
import { ForbiddenError } from "./errors/forbiddenError.js";
```

Then add this route before `app.use(errorHandler)`:

```ts
app.get("/forbidden-demo", (_req, _res, next) => {
  next(new ForbiddenError("You do not have permission to perform this action"));
});
```

Request it:

```sh
curl -i http://localhost:5000/forbidden-demo
```

Expected response:

```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action"
}
```

Remove the temporary route and import after the demo. A 401 means the request has not authenticated ("who are you?"); a 403 means the user is authenticated but is not allowed to perform the action. This distinction lets a frontend prompt for sign-in on 401 and show an access-denied state on 403.

## 500: safe system-error response

The project currently includes a temporary route that throws an unexpected error:

```sh
curl -i http://localhost:5000/boom-unexpected
```

The client should see only:

```json
{
  "status": "error",
  "message": "Something went wrong on our end"
}
```

The server terminal logs the underlying error for developers. The client is not given the exception message or stack trace. Once the demo is complete, remove `/boom-unexpected` from `src/index.ts`.
