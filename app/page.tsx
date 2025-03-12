"use client";

import Recorder from "@/components/Recorder";

export default function Home() {
  return (
    <div style={styles.container}>
      <Recorder mode="single" title="Pratiquer un exposé oral" promptKey="studentOralPresentation" />
      <Recorder mode="conversation" title="Simuler un entretien d'embauche" maxExchanges={5} promptKey="jobInterview" />
      <Recorder mode="conversation" title="Simuler une réunion professionnelle" maxExchanges={5} promptKey="meetingPresentation" />
      <Recorder mode="single" title="Obtenir le résumé d'un discours" promptKey="oralSessionSummary" />
      <Recorder mode="single" title="Améliorer son expression" promptKey="reformulation" />
      <Recorder mode="single" title="Générer un script de discours" promptKey="speechScriptGeneration" />
    </div>
  );

}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    textAlign: "center" as const,
  }
};
