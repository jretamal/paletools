import getWindow from "./window";

const fallbackCommands = {
    "openurl": args => location.href = args
};

class MessageBus {

    constructor() {
        this.subscribers = {};
    }

    publish(cmd, args) {
        if (getWindow().jsBridge) {
            getWindow().jsBridge.invokeAction(JSON.stringify({ command: cmd, commandArgs: args }));
            return;
        }

        if(fallbackCommands[cmd]){
            fallbackCommands[cmd](args);
        }
    }

    subscribe(cmd, callback) {
        if (!this.subscribers[cmd]) {
            this.subscribers[cmd] = [];
        }
        this.subscribers[cmd].push(callback);
    }

    notify(cmd, args) {
        if (this.subscribers[cmd]) {
            for (let sub of this.subscribers[cmd]) {
                sub(args);
            }
        }
    }
}

const messageBus = new MessageBus();

getWindow().messageBus = messageBus;

export default messageBus;
