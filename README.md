# Template for Express app w/ Basic Auth

## Set up

You need to create at least two databases, this can be local or elsewhere, just make sure you put the URL for the databases in your ENV files. When deploying to prod, you'll want another DB for that.

### Environment Variables

To run this project, you will need two .env files

.env

```
NODE_ENV=<'development' | 'production'>

ACCESS_SECRET=''

REFRESH_SECRET=''

PORT=

DATABASE_URL="<url of database>"

EXTRA_ORIGINS="<comma separated list of extra origins allowed for CORS besides localhost>"
```

<!-- Put IP of device running server if you want to access from other devices, domain if using domain, etc. -->

.env.test (for testing environment)

```
NODE_ENV='test'

ACCESS_SECRET=''

REFRESH_SECRET=''

DATABASE_URL="<url of database for tests>"

EXTRA_ORIGINS="<same as above>"
```
