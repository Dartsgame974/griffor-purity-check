import { CategoryScore, Language } from "@/types/quiz";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  scores: CategoryScore[];
  totalScore: number;
  maxTotalScore: number;
  language: Language;
  onRestart: () => void;
  onCommunityClick: () => void;
}

const QuizResults = ({
  scores,
  totalScore,
  maxTotalScore,
  language,
  onRestart,
  onCommunityClick,
}: QuizResultsProps) => {
  const percentage = (totalScore / maxTotalScore) * 100;

  const getMessage = () => {
    if (percentage < 20) {
      return language === "fr"
        ? "Tu ne serais pas en train de mentir ? Tu es un peu trop pur pour un joueur de Valorant."
        : "Aren't you lying? You're a bit too pure for a Valorant player.";
    }
    if (percentage < 40) {
      return language === "fr"
        ? "Plutôt clean ! Tu joues fair-play."
        : "Pretty clean! You play fair.";
    }
    if (percentage < 60) {
      return language === "fr"
        ? "Joueur moyen, quelques moments douteux..."
        : "Average player, some questionable moments...";
    }
    if (percentage < 80) {
      return language === "fr"
        ? "Attention, tu tombes dans la zone rouge !"
        : "Warning, you're entering the red zone!";
    }
    return language === "fr"
      ? "Absolument déchaîné ! Tu es la définition du chaos Valorant."
      : "Absolutely unhinged! You are the definition of Valorant chaos.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-valopurity">
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

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="px-12 glow-primary"
          >
            {language === "fr" ? "Recommencer le test" : "Restart the test"}
          </Button>
          <Button
            onClick={onCommunityClick}
            size="lg"
            variant="outline"
            className="px-12"
          >
            {language === "fr"
              ? "Participer au réajustement des questions"
              : "Contribute to the question adjustment"}
          </Button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground space-y-2">
          <div>
            {language === "fr" ? "Créé par" : "Created by"}{" "}
            <span className="text-primary font-semibold">Dartsgame</span>
          </div>
          <div>
            {language === "fr" ? "Merci à" : "Thanks to"}{" "}
            <a
              href="https://x.com/JDawesome23"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @JDawesome23
            </a>{" "}
            {language === "fr" 
              ? "pour certaines questions et l'idée du test de pureté" 
              : "for certain questions and the purity test idea"}
          </div>
          <div className="text-xs">
            {language === "fr" ? "Site créé avec" : "Website made with"}{" "}
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Lovable AI
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default QuizResults;
