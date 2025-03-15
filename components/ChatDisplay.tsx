import React from "react";

interface ChatDisplayProps {
  response: Record<string, string | string[]> | null;
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ response }) => {
  if (!response) return null;

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg max-w-2xl">
      {typeof response.introduction === "string" && (
        <p className="text-lg">{response.introduction}</p>
      )}

      <div className="mt-2 space-y-2">
        {Object.entries(response).map(([key, value]) => {
          if (key === "introduction" || key === "titre") return null;

          return (
            <div key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong>

              {Array.isArray(value) ? (
                <ul className="list-disc ml-5">
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : typeof value === "string" ? (
                <p>{value}</p>
              ) : (
                <p className="text-red-500">Erreur : Valeur inattendue.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDisplay;



// import React from "react";

// interface ChatDisplayProps {
//   response: string | null;
// }

// const ChatDisplay: React.FC<ChatDisplayProps> = ({ response }) => {
//   if (!response) return null;

//   let parsedResponse: Record<string, string | string[]>;
//   try {
//     parsedResponse = JSON.parse(response);
//   } catch (error) {
//     return <p className="text-red-500">Erreur : Impossible de lire la réponse de l'IA.</p>;
//   }

//   return (
//     <div className="mt-4 p-4 border border-gray-300 rounded-lg max-w-2xl">
//       {parsedResponse.introduction && (
//         <p className="text-lg">{parsedResponse.introduction}</p>
//       )}
//       <div className="mt-2 space-y-2">
//         {Object.entries(parsedResponse).map(([key, value]) => (
//           key !== "introduction" && key !== "titre" && (
//             <div key={key}>
//               <strong>{key.charAt(0).toUpperCase() + key.slice(1)} :</strong>
//               {Array.isArray(value) ? (
//                 <ul className="list-disc ml-5">
//                   {value.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>{value}</p>
//               )}
//             </div>
//           )
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatDisplay;