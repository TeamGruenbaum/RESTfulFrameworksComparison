export class BadRequestError extends Error {
    messages;
    constructor(messages) {
        super();
        this.messages = messages;
    }
}
