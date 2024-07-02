Extremely new and original idea I'm sure nothing like this exists at all

Wouldn't rely on this at all, just use [watt](https://gunnwatt.web.app).

...

`./client` stores the client

`./server` stores the server (Bun required for `bun:sqlite`)

`./shared` stores shared types and enums (Requires linking with your package manager)

```bash
# ./shared
bun link

# ./client + ./server
bun link shared
bun i
bun dev # Port 3000 (client), 443 (server)
```

### Environment Variables
Create a `.env` file in both the client and server folders

#### Client Variables
- `NEXT_PUBLIC_API_URL`
  - URL of ./server instance
  - `http://localhost:443` for development
- `NEXT_PUBLIC_CALLBACK_URL` 
  - Callback URL for Schoology OAuth
  - Anywhere that will lead back to /callback
  - `tttm.us/callback/callback` should work for development as Schoology blocks `localhost` and `127.0.0.1`

#### Server Variables
- `JWT_SECRET`
  - Secret key for signing and verifying user JWT's
  - The more random the better :>
  - Great place to show off that creativity
- `SCHOOLOGY_KEY` + `SCHOOLOGY_SECRET`
  - Schoology API credentials
  - Obtained from /api or Schoology developer app center
  - Requires permission to `GET /v1/users/{uid}/sections`

### Enjoy!
Or I suppose you could use something that exists already and is far more functional and robust

Yeah on second thought maybe just do that