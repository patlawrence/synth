module.exports = class Event {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = name;
        this.type = options.type || 'on'; // can event fire multiple times or just once
        this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client; // defines who will emit the event
    }

    async run(...args) {
        throw new Error(`Event ${this.name} doesn't have a run() function`);
    }
}
