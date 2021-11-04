var express = require('express');

var app = express();
var bodyParser = require('body-parser');
const { v4: uuidV4 } = require('uuid');
var jsonparser = bodyParser.json;
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var server1 = require('http').Server(app);
app.set('view engine','ejs');
app.use(express.static('public'));
let auth = true;
var usern1,usern2;
let pass = 0;
var roomid = uuidV4();
let oneortwo = true;
// console.log(`/${uuidV4()}`);
app.get('/',(req,res)=>{
    console.log('here');
    if(auth==false)
    res.redirect('/start');
    else {
      // auth = false;
      pass = (Math.floor(100000 + Math.random() * 900000));
      console.log(pass);
      
      // pass = toString(pass);
    
    res.redirect('/start2');
    }
});
app.get('/start2' , (req,res) => {
  res.render('start2');
})
app.post('/start2',urlencodedParser, (req,res) => {
  usern2 = req.body.username;
  console.log("room id is " +  roomid);
  res.redirect(`/${roomid}`);
})
app.get('/start',(req,res) => {
  res.render('start');
});
app.post("/start",urlencodedParser,(req,res) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  usern1 = req.body.username;var stringpass = req.body.passcode;
  console.log("The passcode is " + pass)
  var newpass = 0;
  for(var i=6;i>=1;i--){
   newpass = newpass + Math.pow(10, (i-1))*(stringpass[6-i]);
  }
  console.log("the number password is " + newpass);
  console.log("The comparision is " + (pass === newpass))
  if(pass === newpass){
    
  auth = true;
  res.redirect(`/${roomid}`);}
  else{
    console.log("i am here also");
    // alert("Hello\nHow are you?");
    res.redirect('/start');
  }
  console.log(req.body);
  });
// console.log(roomId)

app.get(`/${roomid}`, (req,res) =>
{ if(auth==false){
  console.log("auth here is " + auth);
  res.redirect('/start');
}
else{
  // auth = false;
  var hereuser;
  if(oneortwo === true){
    hereuser = usern2;
  }
  else{
    hereuser = usern1;
  }
  console.log
  oneortwo = false;
  res.render('room',{ roomId: roomid , username: hereuser , password: pass});
  console.log("auth is " + auth);
  auth = false;
}
})



// var server = app.listen(process.env.PORT || 3000, listen);
const io = require('socket.io')(server1
  , {
  cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  },
  allowEIO3: true
}
);
// This call back just tells us that the server has started


// var state = {
//             edit: '#include <iostream>\n\nstruct Node\n{\n  int data;\n  Node *prev, *next;\n};\n\nNode *head = NULL;\n\nvoid create(int A[], Node *head);\nvoid display(Node *head);\n\nint main()\n{\n  int A[] = {2, 4, 6, 8, 10};\n  create(A, head);\n  std::cout << "HEAD" << std::endl;\n  display(head);\n  return 0;\n}\n\nvoid display(Node *p)\n{\n  while (p)\n  {\n    std::cout << "[" << p->prev << "|" << p->data << "|" << p << "|" << p->next << "]" << std::endl;\n    p = p->next;\n  }\n}\n\nvoid create(int A[], Node *p)\n{\n  Node *node = new Node;\n  node->data = A[0];\n  node->next = node->prev = NULL;\n\n  head = node;\n\n  Node *tail = head;\n\n  for (int i = 1; i < 5; i++)\n  {\n    Node *node = new Node;\n    node->data = A[i];\n    node->next = NULL;\n    node->prev = tail;\n\n    tail->next = node;\n\n    tail = node;\n  }\n}'
//               ,
//             cursor : {line: 1, ch: 1}  
//             };

    
io.on('connection', newConnection);
 function newConnection(socket)
{

  console.log("User connected :" + socket.id);
  socket.on("join-room", (roomId, userId) => {
     socket.join(roomId);
  io.to(roomId).emit('user-connected', userId)

  socket.on('disconnect', () => {
    socket.to(roomId).emit('user-disconnected', userId)
  })
  })


  socket.on("emit",emitfn);
  function emitfn(data){
    socket.broadcast.emit('emit',data);
  }
};

server1.listen(3000, () => {
  console.log("listening on 3000");
})
// io.sockets.on("connection", (socket) => {
//   console.log('here');
//   console.log(socket.id);

//   socket.on("emit", (arg) => {
//     state = arg;
//     console.log(arg);
//     socket.broadcast.emit("emit", state);
//   });
// });


// app.set('view engine', 'ejs')



// app.get('/home',(req,res) => {
//   res.render('home'); 
// });






// app.get('/',(err,req) => {
//   if(!err)
//   {
    
//   }
// });

