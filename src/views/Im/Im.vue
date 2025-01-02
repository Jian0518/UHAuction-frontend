<template>
  <div style="padding: 10px; margin-bottom: 50px">
    <el-row>
      <el-col :span="8">
        <el-card style="width: 100%; min-height: 300px; color: #333">
          <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">
            Online Users
            <span style="font-size: 12px">(Click to chat)</span>
          </div>
          <div
            style="padding: 10px 0"
            v-for="user in users"
            :key="user.username"
          >
            <span>{{ user.username }}</span>
            <i
              class="el-icon-chat-dot-round"
              style="margin-left: 10px; font-size: 16px; cursor: pointer"
              @click="chatUser = user.username"
            ></i>
            <span
              style="font-size: 12px; color: limegreen; margin-left: 5px"
              v-if="user.username === chatUser"
            >
              chatting...
            </span>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <div
          style="
            width: 800px;
            margin: 0 auto;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px #ccc;
          "
        >
          <div style="text-align: center; line-height: 50px">
            Chat Room {{ chatUser }}
          </div>
          <div
            style="height: 350px; overflow: auto; border-top: 1px solid #ccc"
            v-html="content"
          ></div>
          <div style="height: 200px">
            <textarea
              v-model="text"
              style="
                height: 160px;
                width: 100%;
                padding: 20px;
                border: none;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                outline: none;
              "
            ></textarea>
            <div style="text-align: right; padding-right: 10px">
              <el-button type="primary" size="mini" @click="send"
                >Send</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
let socket;
export default {
  name: "Chat",
  data() {
    return {
      curUrl:
        "https://cube.elemecdn.com/3/f2/3eab6ece4619dc24b926272f61e7epng.png",
      isCollapse: false,
      users: [],
      chatUser: "",
      text: "",
      texts: [],
      content: "",
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["token", "user"]),
  },
  methods: {
    send() {
      if (!this.chatUser) {
        this.$message({
          type: "warning",
          message: "Please select a user to chat with",
        });
        return;
      }
      if (!this.text) {
        this.$message({ type: "warning", message: "Please enter a message" });
        return;
      }
      if (typeof WebSocket === "undefined") {
        console.log("Your browser does not support WebSocket");
      } else {
        console.log("Your browser supports WebSocket");
        // Send message
        let message = {
          from: this.user.username,
          to: this.chatUser,
          text: this.text,
        };
        socket.send(JSON.stringify(message)); // Send the message to the server
        this.texts.push({ user: this.user.username, text: this.text }); // Display the message in the current chat window
        this.createContent(null, this.user.username, this.text);
        this.text = "";
      }
    },
    createContent(remoteUser, nowUser, text) {
      // This function converts a json into a web-friendly HTML string
      let html;
      if (nowUser) {
        // When the current logged-in user sends a message, align to the right
        html = `
          <div class="el-row" style="padding: 5px 0">
            <div class="el-col el-col-22" style="text-align: right; padding-right: 10px">
              <div class="tip left">${text}</div>
            </div>
            <div class="el-col el-col-2">
              <div class="el-avatar el-avatar--circle" style="height: 40px; width: 40px; line-height: 40px">
                <img src="https://cn.gravatar.com/avatar/${this.user.id}?s=164&d=monsterid" style="object-fit: cover;" />
              </div>
            </div>
          </div>
        `;
      } else if (remoteUser) {
        // When another user sends a message, align to the left
        html = `
          <div class="el-row" style="padding: 5px 0">
            <div class="el-col el-col-1">
              <div class="el-avatar el-avatar--circle" style="height: 40px; width: 40px; line-height: 40px">
                <img src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1722038400&semt=sph" style="object-fit: cover;" />
              </div>
            </div>
            <div class="el-col el-col-22" style="text-align: left; padding-left: 10px">
              <div class="tip right">${text}</div>
            </div>
          </div>
        `;
      }
      console.log(html);
      this.content += html;
    },
    init() {
      let username = this.user.username;
      if (typeof WebSocket === "undefined") {
        console.log("Your browser does not support WebSocket");
      } else {
        console.log("Your browser supports WebSocket");
        socket = new WebSocket(`ws://localhost:8000/imserver/${username}`);
        socket.onopen = () => {
          console.log("WebSocket is open");
        };
        // Listen for messages from the WebSocket server and handle text messages
        socket.onmessage = (msg) => {
          console.log("Received data: " + msg.data);
          let data = JSON.parse(msg.data);
          if (data.users) {
            // Update the user list
            this.users = data.users.filter(
              (user) => user.username !== username
            );

          } else {
            // If the message received does not contain the 'users' key, it's a chat message in JSON format
            // { "from": "zhang", "text": "hello" }
            if (data.from === this.chatUser) {
              this.texts.push(data);
              // Construct the message content
              this.createContent(data.from, null, data.text);
            }
          }
        };

        // Handle WebSocket close event
        socket.onclose = () => {
          console.log("WebSocket is closed");
        };

        // Handle WebSocket error event
        socket.onerror = () => {
          console.log("WebSocket encountered an error");
        };
      }
    },
  },
};
</script>

<style>
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
}
.right {
  background-color: deepskyblue;
}
.left {
  background-color: greenyellow;
}
</style>
