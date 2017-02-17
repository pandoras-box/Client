# Client
## Pandora's Box

### Summary
Pandora's Box is a mobile app and Internet of Things project designed to streamline and gamify interactions with parents and children on the subject of chores or tasks. It sets up a system where there  is a tangible reward controlled by the mobile application. 

Parents create tasks remotely and approve them but the kids ultimately get the satisfaction of remotely opening the box to get their reward. 



### Installing
NOTE: You will need to clone three repositories: client(https://github.com/pandoras-box/Client), server(https://github.com/pandoras-box/Server) and pi-server(https://github.com/pandoras-box/Pi-Server)

* Fork and clone this repo
* `$ cd` into the folder and `$ npm install`
* Create a facebook developer OAuth account for authorization
* Install xcode https://developer.apple.com/ if using ios
* plug phone in to view on phone or use simulator
* Launch nodemon on the server with `$ PORT=5000 nodemon` from the root of the sever repo
* Launch app with `$ cordova build ios` or `$ cordova build ios` from the root of the client repo
* Compile 
* View
