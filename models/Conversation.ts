import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  title: string;
  text: string;
  finalResponse: string;
  score?: number | null;
  createdAt: Date;
  scenario: string;
}

const ConversationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    finalResponse: { type: String, required: true },
    score: { type: Number, required: false, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    scenario: { type: String, required: true },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.models.Conversation as Model<IConversation> || mongoose.model<IConversation>("Conversation", ConversationSchema);

export default ConversationModel;
