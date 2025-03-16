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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-[#232323] text-[#c0bb39] border border-[#c0bb39] p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">{conversation.title}</h2>
        <p className="text-gray-400 text-sm mb-4">
          📅 {new Date(conversation.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div className="border-t border-[#c0bb39] pt-4">
          <h3 className="text-lg font-semibold mb-1">📝 Texte :</h3>
          <p className="text-[#e4e4e4] whitespace-pre-line">{conversation.text}</p>
        </div>

        <div className="border-t border-[#c0bb39] pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-1">💬 Retour final :</h3>
          <ChatDisplay
            response={typeof conversation.finalResponse === "string"
              ? JSON.parse(conversation.finalResponse)
              : conversation.finalResponse}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
            onClick={onClose}
          >
            ❌ Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;
