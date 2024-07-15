<template>
    <v-main>

    
    <div id="main-content" class="container">
      <div class="row">
        <div class="col-md-6">
          <form class="form-inline" @submit.prevent="connect">
            <div class="form-group">
              <label for="connect">WebSocket connection:</label>
              <button class="btn btn-default" :disabled="connected">Connect</button>
              <button class="btn btn-default" :disabled="!connected" @click.prevent="disconnect">Disconnect</button>
            </div>
          </form>
        </div>
        <div class="col-md-6">
          <form class="form-inline" @submit.prevent="sendName">
            <div class="form-group">
              <label for="name">What is your name?</label>
              <input v-model="name" type="text" id="name" class="form-control" placeholder="Your name here..." />
            </div>
            <button class="btn btn-default" :disabled="!connected">Send</button>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <table id="conversation" class="table table-striped">
            <thead>
              <tr>
                <th>Greetings</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="greeting in greetings" :key="greeting">
                <td>{{ greeting }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</v-main>
</template>
  
<script setup>
import { ref } from 'vue';
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { Client as StompJsClient } from '@stomp/stompjs';

const name = ref('');
const greetings = ref([]);
const connected = ref(false);

let stompClient;

const connect = () => {
  const socket = new SockJS('https://localhost:443/gs-guide-websocket');
  stompClient = new StompJsClient({
    webSocketFactory: () => socket,
    connectHeaders: {},
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/greetings', (greeting) => {
      showGreeting(JSON.parse(greeting.body).content);
    });
  };

  stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  stompClient.activate();
};

const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
  setConnected(false);
  console.log('Disconnected');
};

const sendName = () => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: '/app/hello',
      body: JSON.stringify({ name: name.value }),
    });
  }
};

const setConnected = (connect) => {
  connected.value = connect;
};

const showGreeting = (message) => {
  greetings.value.push(message);
};

</script>

<style>

</style>  