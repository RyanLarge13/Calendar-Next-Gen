class SocketDBInterface {
  constructor(clinets = [], messages = [], rooms = []) {
    this.clients = new Map();
    this.messages = new Map();
    this.rooms = new Map();

    this.initializeClient();
  }

  initializeClient() {}
}
