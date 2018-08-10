
WebRTC Data Channel Demo

1. Edit credentials.txt with your own STUN/TURN credentials from twilio or xirsys.
2. Host the demo with a simple web server (the Web Server for Chrome extension works).
3. Open the demo page on two different machines, select the "Relay" policy and click connect to obtain an ID.
4. On the client machine, enter the server machine ID in the "Remote ID" box and click "connect to peer".
5. Once connected, enter text in the message box and click "Send message".

Rely on the fact that messages can still be sent and received to determine if the traffic still goes through. An error message may be displayed if the application gets disconnected from the PeerJS servers (the signaling server that provides the unique ID for the connection).

To close the connection gracefully, just close the browser tab.

To get a clean capture in wireshark, use the "stun" filter. To get only important STUN/TURN traffic, use "stun && stun.type != 0x16 && stun.type != 0x17".

