import React from "react";

interface ChatDisplayProps {
  response: Record<string, string | string[]> | null;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ response }) => {
  if (!response) return null;

  return (
    <div className="mt-6 p-6 border bg-white text-black rounded-lg max-w-2xl shadow-lg">
      {typeof response.introduction === "string" && (
        <p className="text-lg font-semibold">📝 {response.introduction}</p>
      )}

      <div className="mt-4 space-y-3">
        {Object.entries(response).map(([key, value]) => {
          if (key === "introduction" || key === "titre") return null;

          return (
            <div key={key} className="border-l-4 border-white pl-3 py-2">
              <strong className="text-lg">🔹 {key.charAt(0).toUpperCase() + key.slice(1)} :</strong>

              {Array.isArray(value) ? (
                <ul className="list-disc ml-5 mt-1 space-y-1">
                  {value.map((item, index) => (
                    <li key={index} >{item}</li>
                  ))}
                </ul>
              ) : typeof value === "string" ? (
                <p className="mt-1">{value}</p>
              ) : (
                <p className="text-red-500">⚠️ Erreur : Valeur inattendue.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDisplay;
