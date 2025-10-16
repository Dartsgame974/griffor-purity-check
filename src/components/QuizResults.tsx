import { CategoryScore, Language } from "@/types/quiz";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  scores: CategoryScore[];
  totalScore: number;
  maxTotalScore: number;
  language: Language;
  onRestart: () => void;
}

const QuizResults = ({
  scores,
  totalScore,
  maxTotalScore,
  language,
  onRestart,
}: QuizResultsProps) => {
  const percentage = (totalScore / maxTotalScore) * 100;

  const getMessage = () => {
    if (percentage < 20) {
      return language === "fr"
        ? "Tu es un ange ! Presque trop pur pour ce monde gaming."
        : "You're an angel! Almost too pure for this gaming world.";
    }
    if (percentage < 40) {
      return language === "fr"
        ? "Plutôt clean ! Tu joues fair-play."
        : "Pretty clean! You play fair.";
    }
    if (percentage < 60) {
      return language === "fr"
        ? "Gamer moyen, quelques moments douteux..."
        : "Average gamer, some questionable moments...";
    }
    if (percentage < 80) {
      return language === "fr"
        ? "Attention, tu tombes dans la zone rouge !"
        : "Warning, you're entering the red zone!";
    }
    return language === "fr"
      ? "Absolument déchaîné ! Tu es la définition du chaos gaming."
      : "Absolutely unhinged! You are the definition of gaming chaos.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-pervers to-nerd bg-clip-text text-transparent">
            {language === "fr" ? "Résultats" : "Results"}
          </h1>
          <div className="text-5xl md:text-7xl font-black mb-4">
            {totalScore} / {maxTotalScore}
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {getMessage()}
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {scores.map((category) => (
            <div
              key={category.name}
              className="bg-card border border-border rounded-xl p-6 hover:scale-105 transition-transform duration-300 animate-slide-up"
              style={{
                borderColor: category.color,
                boxShadow: `0 0 20px ${category.color}40`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: category.color }}
              >
                {category.name}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{category.score}</span>
                <span className="text-xl text-muted-foreground">
                  / {category.maxScore}
                </span>
              </div>
              <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${(category.score / category.maxScore) * 100}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="px-12 glow-primary"
          >
            {language === "fr" ? "Recommencer" : "Restart"}
          </Button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          {language === "fr" ? "Crédit" : "Credit"}:{" "}
          <a
            href="https://x.com/JDawesome23"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            @JDawesome23
          </a>
        </footer>
      </div>
    </div>
  );
};

export default QuizResults;
