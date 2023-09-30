# Newman Commands

## Running Locally

Make sure node, newman and htmlextra is installed.

```shell
newman run collection.json -e environment.json -r htmlextra
```

## Docker

I had this initially but there were a few complications:
- Tests were running before backend services started.
- I will need to introduce a way to check for the above issue.
- Not sure if I want to include the tests as a service - maybe its okay for development only docker compose file?