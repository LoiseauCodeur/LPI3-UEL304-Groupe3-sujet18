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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#f8ffff] p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
        {/* Bouton de fermeture en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition duration-300"
          aria-label="Fermer la modale"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-[#004aad] mb-2">{conversation.title}</h2>
        <p className="text-gray-600 mb-4 text-sm italic">
          📅 {new Date(conversation.createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Texte de la conversation */}
        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-lg font-semibold text-[#004aad] mb-2">📝 Texte :</h3>
          <p className="text-gray-800 bg-[#a8d2e9] p-3 rounded-md whitespace-pre-line shadow-md">
            {conversation.text}
          </p>
        </div>

        {/* Retour final */}
        <div className="border-t border-gray-300 pt-4 mt-4">
          <h3 className="text-lg font-semibold text-[#004aad] mb-2">💬 Retour final :</h3>
          <div className="bg-white p-3 rounded-md shadow-md">
            <ChatDisplay
              response={
                typeof conversation.finalResponse === "string"
                  ? JSON.parse(conversation.finalResponse)
                  : conversation.finalResponse
              }
            />
          </div>
        </div>

        {/* Bouton de fermeture en bas */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-white font-semibold bg-[#004aad] hover:bg-[#003488] rounded-lg transition duration-300 shadow-md"
          >
            🔙 Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;

