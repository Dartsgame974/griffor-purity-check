import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question, Language } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  language: Language;
  onAnswer: (answer: boolean) => void;
}

const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  language,
  onAnswer,
}: QuizQuestionProps) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              {language === "fr" ? "Progression" : "Progress"}
            </span>
            <span className="text-sm font-semibold">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-8 shadow-xl">
          <p className="text-2xl md:text-3xl font-semibold text-center leading-relaxed">
            {question[language]}
          </p>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onAnswer(true)}
            size="lg"
            className="h-20 text-xl font-semibold bg-primary hover:bg-primary/90 glow-primary transition-all"
          >
            {language === "fr" ? "Oui" : "Yes"}
          </Button>
          <Button
            onClick={() => onAnswer(false)}
            size="lg"
            variant="outline"
            className="h-20 text-xl font-semibold hover:bg-secondary transition-all"
          >
            {language === "fr" ? "Non" : "No"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;
