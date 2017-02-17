# Client
## Pandora's Box
Pandora's Box is a mobile app and Internet of Things project designed to streamline and gamify Interactions with parents and children on the subject of chores or tasks. It sets up a system where there  is a tangible reward controlled by the mobile application. 

Parents create tasks remotely and approve them but the kids ultimately get the satisfaction of remotely opening the box to get their reward. 



### Installing
NOTE: You will need to clone three repositories: client(https://github.com/pandoras-box/Client), server and r-pi repo

* Fork and clone this repo
* `$ cd` into the folder and `$ npm install`
* Create a PSQL database named `denver-events`
* Run `$ knex migrate:latest` and `$ knex seed:run`
* See the `example.env` file for needed Environment variables
  * Don't forget to create your own `.env` file with your project's specific Environment variables
* Create a Google OAuth account for authorization
* Launch nodemon on the server with `$ nodemon` from the root of the sever repo
* Launch an http-server with `$ http-server` from the root of the client repo
* When this is all ready, visit http://localhost:8080 from your browser to launch the landing page
