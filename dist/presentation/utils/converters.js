"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToConversation = convertToConversation;
function convertToConversation(doc) {
    return {
        id: doc._id.toString(),
        participants: doc.participants.map(id => id.toString()),
        messages: doc.messages.map(id => id.toString()),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
}
