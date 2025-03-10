"use client";

import Recorder from "@/components/Recorder";

export default function Home() {
  return (
    <div style={styles.container}>
      <Recorder mode="single" promptKey="studentOralPresentation" />
      <Recorder mode="conversation" maxExchanges={5} promptKey="jobInterviewSimulation" />
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
