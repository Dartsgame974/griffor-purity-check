import { Button } from "@/components/ui/button";
import { Language } from "@/types/quiz";

interface LanguageSelectorProps {
  onSelectLanguage: (lang: Language) => void;
}

const LanguageSelector = ({ onSelectLanguage }: LanguageSelectorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-pervers to-nerd bg-clip-text text-transparent">
          Valopurity
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          Test de Pureté Valorant / Valorant Purity Test
        </p>
        
        <div className="flex gap-6 justify-center">
          <Button
            onClick={() => onSelectLanguage("fr")}
            variant="outline"
            size="lg"
            className="group relative overflow-hidden h-32 w-32 text-2xl border-2 hover:border-primary transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-6xl mb-2">🇫🇷</span>
          </Button>
          
          <Button
            onClick={() => onSelectLanguage("en")}
            variant="outline"
            size="lg"
            className="group relative overflow-hidden h-32 w-32 text-2xl border-2 hover:border-primary transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-6xl mb-2">🇬🇧</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
