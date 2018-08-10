var peer = null;
var connection = null;
var connected = false;

function connect() {
    var stun = document.getElementById("stun").value;
    var turn = document.getElementById("turn").value;
    var turn_user = document.getElementById("turn_user").value;
    var turn_cred = document.getElementById("turn_cred").value;
    var policy = document.getElementById("transportPolicy").value;
    var config_server = [];
    document.getElementById("status").innerHTML = "Status: ";

    if (stun !== "") {
        config_server.push({urls: stun});
    }

    if (turn !== "") {
        config_server.push({urls: turn, username: turn_user, credential: turn_cred});
    }

    peer = new Peer({
        config: {
            'iceServers': config_server,
            'iceTransportPolicy': policy
        }
    });

    // When the connection with the peerServer is open
    peer.on('open', function (id) {
        console.log("Connection with the Peer Server is open.");
        document.getElementById("id").innerHTML = "ID: <b>"+ id + "</b>";
        //document.getElementById("disconnect_btn").disabled = false;

        // When a remote connects itself on me
        peer.on('connection', function(conn){
            console.log("Connection from a remote peer is established.");

            conn.on('open', function () {
                console.log("Connection with the remote is ready to use.");

                document.getElementById("status").innerHTML = "Status: <span style='color: green'>Connected!</span>";
                document.getElementById("sdp_local").value += conn.peerConnection.localDescription.sdp;
                document.getElementById("sdp_remote").value += conn.peerConnection.remoteDescription.sdp;

                connection = conn;
                conn.on('data', function (data) {
                    console.log("Data received from peer.");
                    document.getElementById("msg").innerHTML += "Data received: " + data + "<br />";
                });
            });
        });

        // When there is an error
        peer.on('error', function(err){
            console.log("error");
            document.getElementById("status").innerHTML = "Status: <span style='color: red'>"+err+"</span>";
        });
    });
}

function connect_peer(){
    var remote_id = document.getElementById("remote_id").value;

    // New DataConnection
    connection = peer.connect(remote_id);

    // When a connection between 2 peer is ready to use
    connection.on('open', function () {
        console.log("Connection with the remote is ready to use.");

        document.getElementById("status").innerHTML = "Status: <span style='color: green'>Connected!</span>";
        document.getElementById("sdp_local").value += connection.peerConnection.localDescription.sdp;
        document.getElementById("sdp_remote").value += connection.peerConnection.remoteDescription.sdp;

        // When data is received from the remote peer
        connection.on('data', function (data) {
            console.log("Data received from peer.");
            document.getElementById("msg").innerHTML += "Data received: " + data + "<br />";
        });
    });
}

function send(){
    document.getElementById("msg").innerHTML += "Data sent: " + document.getElementById("message").value + "<br />";
    connection.send(document.getElementById("message").value);
}

function disconnect() {
    document.getElementById("connect_to_peer").style.display = "block";
    peer.disconnect();
    connection.close();
    document.getElementById("id").innerHTML = "ID: ";
    document.getElementById("disconnect_btn").disabled = true;
    document.getElementById("message").disabled = true;
    document.getElementById("send_button").disabled = true;
    document.getElementById("status").innerHTML = "Status: ";
}

function load(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var creds = JSON.parse(this.responseText);
            document.getElementById("stun").value = creds.stun;
            document.getElementById("turn").value = creds.turn;
            document.getElementById("turn_user").value = creds.username;
            document.getElementById("turn_cred").value = creds.credential;
        }
    };
    xmlhttp.open("GET", "credentials.txt", true);
    xmlhttp.send();
}

