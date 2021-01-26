# dm-server

The backend server for [Dunder Mifflin Infinity](https://github.com/caitlincraw/dunder-mifflin). 

## Installing and Using dm-server

* Install [Node.js](https://nodejs.org/en/download/).
* Clone the repository.
* Use the package manager [npm](https://www.npmjs.com/get-npm) to run `npm install` in the project directory.
* Create a `.env` file in the root of the project. The following variables are required:
    * `PORT`: Port where the backend server will run; use 1725 for local development
    * `DB_USER`: Local user
    * `DB_PASS` : Local user password
    * `DB_NAME` : Local database, use pandemicpatios_dev 
    * `DB_HOST` : Local hosting platform, use localhost
    * `ORIGIN_PATH` : Front-end hosting url, use http://localhost:3000 for local testing
         
* Run `npm start` to start the server.
* Visit `http://localhost:1725`.
