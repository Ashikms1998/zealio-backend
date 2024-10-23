import { Conversation, ConversationDocument } from "../../entities/Message"


export function convertToConversation(doc: ConversationDocument): Conversation {
  return {
    id: doc._id.toString(),
    participants: doc.participants.map(id => id.toString()),
    messages: doc.messages.map(id => id.toString()),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}