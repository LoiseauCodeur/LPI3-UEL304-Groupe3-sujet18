"use client";

import Recorder from "@/components/Recorder";
import RecorderVoiceAnswer from "@/components/RecorderVoiceAnswer";

export default function Home() {
  return (
    <div style={styles.container}>
      <Recorder />
      <RecorderVoiceAnswer />
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
