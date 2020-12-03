const { EventEmitter } = require('events');
const connection = require('../database.js');

class StateManager extends EventEmitter { // this class emits custom events and allows us to control state for the entire application
    constructor() {
        super();
        connection.then(connection => this.connection = connection).catch(err => console.log(err)); // creates database connection and then assigns it to an instance variable
    }
}

module.exports = new StateManager(); // only need one StateManager in a class