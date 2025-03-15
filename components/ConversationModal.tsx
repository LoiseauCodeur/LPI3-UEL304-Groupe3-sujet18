import React from "react";
import { Conversation } from "@/composables/useConversations";
import ChatDisplay from "@/components/ChatDisplay";

interface ConversationModalProps {
  conversation: Conversation | null;
  onClose: () => void;
}

const ConversationModal: React.FC<ConversationModalProps> = ({ conversation, onClose }) => {
  if (!conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"> 
        <h2 className="text-xl font-semibold mb-2">{conversation.title}</h2>
        <p className="text-gray-500 mb-4">
          {new Date(conversation.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-1">Texte:</h3>
          <p className="text-gray-700 whitespace-pre-line">{conversation.text}</p>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-1">Retour final:</h3>
          <ChatDisplay
            response={typeof conversation.finalResponse === "string"
                ? JSON.parse(conversation.finalResponse)
                : conversation.finalResponse}
            />

        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;
