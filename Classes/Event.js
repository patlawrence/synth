module.exports = class Event { // base class for events
    constructor(client, name, options = {}) {
        this.client = client; // bot client
        this.name = name; // keyword that triggers event
        this.type = options.type || 'on'; // does this event fire multiple times or just once
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client; // defines who will emit the event
    }

    async run(...args) {
        throw new Error(`Event ${this.name} doesn't have a run() function`);
    }
}