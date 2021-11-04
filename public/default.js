var senddata;let localStream;
// const { on } = require("events");

// const { sensitiveHeaders } = require("http2");

const splash = document.querySelector('.splash');
// const lang = document.getElementById('lang').value;
// var language = "";
// if(lang == "cpp"){
//   language = "text/x-c++src";
// }
// else{
//   language = "text/x-java";
// }
document.addEventListener('DOMContentLoaded',(e) => {
  setTimeout(() => {
    splash.classList.add('display-none')
  }, 2000);
})

function muteAudio()
{ 
  // var camerabu = document.getElementById("checkcamera");
var audiobu = document.getElementById("checkaudio");
var isAudio = audiobu.checked;
  console.log(isAudio);
  // isAudio = !isAudio;
  console.log(localStream.getAudioTracks()[0].enabled);
  localStream.getAudioTracks()[0].enabled = isAudio;
}

function muteVideo()
{ let camerabu = document.getElementById("checkcamera");
// var audiobu = document.getElementById("checkaudio");
var isVideo = camerabu.checked;
  console.log(isVideo);
  // isAudio = !isAudio;
  console.log(localStream.getVideoTracks()[0].enabled)
  localStream.getVideoTracks()[0].enabled = isVideo;
}



var code;
    var editor;
    // const socket;
    const socket = io("/");

    const videoGrid = document.getElementById('video-grid')

    const myPeer = new Peer(undefined, {
      host: '/',
      port: '443'
    })

    const myVideo = document.createElement('video')
    myVideo.muted = true;

    const peers = {}

    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      localStream = stream;
      // localStream
      console.log('done here');
      addVideoStream(myVideo, localStream)
      stream.getVideoTracks().forEach((track)=>{
        // track.stop();
        track.enabled = false;
    });
    
      myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          // console.log('done here');
          console.log('stream received!');
                    // setStreamReceived(true);
                    // getDriverStream(userVideoStream);
          
          addVideoStream(video, userVideoStream);
          stream.getVideoTracks().forEach((track)=>{
            // track.stop();
            track.enabled = false;
        });
        })
      })
    
      socket.on('user-connected', userId => {
        console.log("User connected: " + userId);
        connectToNewUser(userId, stream)
      })

    })
    myPeer.on('open' ,id => {
      
      socket.emit('join-room', ROOM_ID,id);
    })


    

    socket.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close()
    })
    
    
    
    //code here
    // const io = require("socket.io")(server);
     code = document.getElementById('codemirror-textarea');
     editor = CodeMirror.fromTextArea(code, {
        mode: "text/x-java",
        // value: data.edit,
      lineWrapping: true,
      // mode: "javascript",
    //   theme: this.theme,
      theme: "dracula",
      tabSize: 2,
      lineNumbers: true,
      indentWithTabs: true,
      // onCursorActivity: function(){
      //   console.log('here');
      //   sender();
      // },
     });
    // editor.setCursor(data.cursor);
    editor.setSize(screen.hight, screen.width);

    
    

    socket.on('emit',changedata);

    function changedata(data){
    console.log(data.cursor.line);
    editor.getDoc().setValue(data.edit);
    editor.focus();
    // window.lastpo=localStorage.getItem("valueofcursor");
    // editor.setCursor({line: data.cursor.line, ch: data.cursor.ch});
    // alert(window.lastpo);
    // editor.setvalue(data.edit);
    editor.setCursor(data.cursor);
    // editor.setSize(screen.hight, screen.width);
    
    
    }
    
    // editor.on("change", (e) => {
    //   sender();
    // });
    editor.on("keyup", function () {
       senddata = {
        cursor:editor.getCursor(),
        edit :editor.getValue(),
      };
      sender();
  });

function sender(){
//   CodeMirror.on(editor, "cursorActivity", (instance, obj)=>{        
//     console.log(instance.doc.getCursor())
// });
  
  // var cursorpos = editor.getCursor();
  // editor.setCursor(cursorpos);
  socket.emit("emit", senddata);
  console.log(senddata);
}

function addVideoStream(video, stream) {
  // localStream = stream;
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  // console.log('done here');
  videoGrid.append(video)
  // stream.getVideoTracks()[0].enabled = false;
}
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    // addVideoStream(video, userVideoStream)
    console.log('stream received!');
    // setStreamReceived(true);
    // getDriverStream(userVideoStream);

addVideoStream(video, userVideoStream);
stream.getVideoTracks().forEach((track)=>{
// track.stop();
track.enabled = false;
});
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}