import { Button } from "@/components/ui/button";
import { Language } from "@/types/quiz";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onSwitch: (lang: Language) => void;
}

const LanguageSwitcher = ({ currentLanguage, onSwitch }: LanguageSwitcherProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Button
        variant={currentLanguage === "fr" ? "default" : "outline"}
        size="sm"
        onClick={() => onSwitch("fr")}
        className="text-lg"
      >
        🇫🇷
      </Button>
      <Button
        variant={currentLanguage === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => onSwitch("en")}
        className="text-lg"
      >
        🇬🇧
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
