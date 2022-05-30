const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const userTable = require('./usersTest');
const imageTable = require('./imagesTest');
const messageTable = require('./messagesTest');
const express = require('express');
const app = express();
var cors = require('cors');
// const ss = require('socket.io-stream');
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const mongoDBAddress = 'mongodb+srv://khoujani:uY5Exe520XBZrlzc@cluster0.wfifq.mongodb.net/chatdb?retryWrites=true&w=majority&ssl=true';

mongoose.connect(mongoDBAddress,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {


        server.listen(port, () => {
            console.log('Server listening at port %d', port);
        });

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.static(path.join(__dirname, 'public')));


//--------------------------------------REST------------------------------------------------

        app.post('/login', (req, res) => {

            const {username, password, createAccount} = req.body;
            console.log(username + "\t" + password + "\t" + createAccount);

            if (createAccount === "truee") {
                userTable.find({"username": username}).then(result => {
                    console.log(result);

                    if (result.length > 0) {
                        console.log("Username already Taken");
                        res.send({
                            "success": false,
                            "message": "Username already Taken"
                        });
                    } else {
                        console.log("Account Created Successfully");
                        const newUser = new userTable({username: username, password: password})
                        newUser.save().then(() => {
                            res.send({
                                "success": true,
                                "message": "Account Created Successfully"
                            });
                        });
                    }
                })
            } else {
                userTable.find({"username": username, "password": password}).then((result) => {
                    if (result.length > 0) {
                        console.log("Login successfully");
                        res.send({
                            "success": true,
                            "message": "Login successfully"
                        });
                    } else {
                        console.log("Username or password are not match");
                        res.send({
                            "success": false,
                            "message": "Username or password are not match"
                        });
                    }
                }).catch(() => {
                    res.send({
                        "success": false,
                        "message": "Username or password are not match"
                    });
                });
            }
        });

        app.get('/history', (req, res) => {

            //page [1*50=( offset: 50-50:`0`, to: `50`],2*50=( offset: 100-50:`50`, to `100` )
            const {username, page} = req.query;
            const limit = 50;
            const skip = (page * limit) - limit;
            console.log("\n\n\n" + "username:" + username + " page: " + page + " skip:" + skip + " PageSize: 50" + "\n\n\n");

            messageTable.find().sort({'_id': -1}).skip(skip).limit(limit).then(result => {
                res.send({
                    "success": true,
                    "message": "",
                    "data": result
                });
                console.log("history:" + result);
            }).catch(error => {
                console.log("history:" + error);
                res.send({
                    "success": true,
                    "message": "no data",
                    "data": null
                });
            });

        });

        app.post('/updateProfile', (req, res) => {

            const {username, avatar} = req.body;
            const query = {username: username};
            const newData = {avatar: avatar};

            console.log("\n\n\n" + "username:" + username + " avatar:" + avatar + "\n\n\n");

            userTable.updateOne(query, newData,
                function (err, doc) {
                    if (err) {
                        return res.send({
                            "success": false,
                            "message": err
                        });
                    } else {
                        return res.send({
                            "success": true,
                            "message": "Successfully saved."
                        });
                    }
                });

        });

//--------------------------------------REST------------------------------------------------


//--------------------------------------SOCKET------------------------------------------------

        let numUsers = 0;
        io.on('connection', (socket) => {
            socket = socket;

            console.log("Socket Connected");


            app.post('/uploadImage', (req, res) => {
                const {chatId, realName, username, data} = req.body;
                console.log(chatId + "\t" + realName + "\t" + username /*+ "\t" + data*/);
                const newImage = new imageTable({chatId: chatId, username: username, data: data})
                //uploading process
                newImage.save().then((result) => {
                    const newMessage = new messageTable({
                        realName: realName,
                        username: username,
                        message: result._id,
                        messageType: "image"
                    });
                    //broadcasting process
                    console.log("save as new message"+socket.username);
                    newMessage.save().then(() => {
                        socket.broadcast.emit('new message', {
                            realName: realName,
                            username: username,
                            message: result._id,
                            messageType: "image",
                        });
                        console.log("Upload success and message sent");
                    });
                }).catch(() => {
                    res.send({
                        "success": false,
                        "message": "upload failed try again"
                    });
                    console.log("Upload failed");
                });

            });


            let addedUser = false;

            // ss(socket).on('voice', function(stream, data) {
            //     var filename = path.basename(data.name);
            //     stream.pipe(fs.createWriteStream(filename));
            //   });

            // socket.on('private message', ({ data, to }) => {
            // console.log('new message', data);
            //   const newMessage = new messageTable({ msg: data });
            //   newMessage.save().then(()=>{
            //     socket.to(to).emit('private message', {
            //       username: socket.username,
            //       message: data
            //     });
            //   });
            // });

            // socket.on('group message', (data) => {
            // console.log('new message', data);
            //   const newMessage = new messageTable({ msg: data });
            //   newMessage.save().then(()=>{
            //     socket.broadcast.emit('new message', {
            //       username: socket.username,
            //       message: data
            //     });
            //   });
            // });


            socket.on('new message', (data) => {
                console.log(data);
                const {realName, message, messageType,} = data;
                console.log(realName + "\n" + message + "\n" + messageType);
                const newMessage = new messageTable({
                    realName: realName,
                    username: socket.username,
                    message: message,
                    messageType: messageType
                });
                newMessage.save().then(() => {
                    socket.broadcast.emit('new message', {
                        realName: realName,
                        username: socket.username,
                        message: message,
                        messageType: messageType,
                    });
                });
            });

            // socket.on('message update', (data) => {
            //     const {username, password, createdAt, updatedAt} = data;
            //     const newMessage = new messageTable({username: socket.username, msg: data});
            //     newMessage.save().then(() => {
            //         socket.broadcast.emit('new message', {
            //             username: socket.username,
            //             message: data
            //         });
            //     });
            // });

            // socket.on('message delete', (data) => {
            //     const {username, password, createdAt, updatedAt} = data;
            //     const newMessage = new messageTable({username: socket.username, msg: data});
            //     newMessage.save().then(() => {
            //         socket.broadcast.emit('new message', {
            //             username: socket.username,
            //             message: data
            //         });
            //     });
            // });

            socket.on('add user', (username) => {
                if (addedUser) return;
                socket.username = username;
                ++numUsers;
                addedUser = true;
                socket.emit('login', {
                    numUsers: numUsers
                });
                socket.broadcast.emit('user joined', {
                    username: socket.username,
                    numUsers: numUsers
                });
            });

            socket.on('typing', () => {
                socket.broadcast.emit('typing', {
                    username: socket.username
                });
            });

            socket.on('stop typing', () => {
                socket.broadcast.emit('stop typing', {
                    username: socket.username
                });
            });

            socket.on('disconnect', () => {
                if (addedUser) {
                    --numUsers;
                    socket.broadcast.emit('user left', {
                        username: socket.username,
                        numUsers: numUsers
                    });
                }
            });
        });

//--------------------------------------SOCKET------------------------------------------------


    });
