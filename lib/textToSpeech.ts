export type LanguageOption = "en" | "hi" | "as";

interface SpeakTextParams {
  text: string;
  lang: LanguageOption;
  setIsSpeaking: (value: boolean) => void;
  speechRef: React.MutableRefObject<SpeechSynthesisUtterance | null>;
}

export const speakText = ({
  text,
  lang,
  setIsSpeaking,
  speechRef,
}: SpeakTextParams): void => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    alert("Speech synthesis is not supported in this browser.");
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);

  const voiceLangs: Record<LanguageOption, string> = {
    en: "en-IN",
    hi: "hi-IN",
    as: "as-IN",
  };

  utter.lang = voiceLangs[lang] ?? "en-IN";
  utter.rate = 1;
  utter.pitch = 1;

  utter.onstart = () => setIsSpeaking(true);
  utter.onend = () => setIsSpeaking(false);
  utter.onerror = () => setIsSpeaking(false);

  speechRef.current = utter;
  window.speechSynthesis.speak(utter);
};
