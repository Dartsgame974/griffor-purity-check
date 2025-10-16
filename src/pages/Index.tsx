import { useState, useEffect } from "react";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import { Language, QuizData, CategoryScore } from "@/types/quiz";

type Screen = "language" | "quiz" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("language");
  const [language, setLanguage] = useState<Language>("fr");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    cringe: 0,
    toxic: 0,
    pervers: 0,
    nerd: 0,
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch("/questions.json");
      if (!response.ok) throw new Error("Failed to load questions");
      const data: QuizData = await response.json();
      setQuizData(data);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error(
        language === "fr"
          ? "Erreur lors du chargement des questions"
          : "Error loading questions"
      );
    }
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setScreen("quiz");
  };

  const handleLanguageSwitch = (lang: Language) => {
    setLanguage(lang);
  };

  const handleAnswer = (answer: boolean) => {
    if (!quizData) return;

    const question = quizData.questions[currentQuestionIndex];

    if (answer) {
      setScores((prev) => ({
        cringe: prev.cringe + question.cringe,
        toxic: prev.toxic + question.toxic,
        pervers: prev.pervers + question.pervers,
        nerd: prev.nerd + question.nerd,
      }));
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setScreen("results");
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScores({
      cringe: 0,
      toxic: 0,
      pervers: 0,
      nerd: 0,
    });
    setScreen("language");
  };

  const getCategoryScores = (): CategoryScore[] => {
    if (!quizData) return [];

    const maxScores = quizData.questions.reduce(
      (acc, q) => ({
        cringe: acc.cringe + q.cringe,
        toxic: acc.toxic + q.toxic,
        pervers: acc.pervers + q.pervers,
        nerd: acc.nerd + q.nerd,
      }),
      { cringe: 0, toxic: 0, pervers: 0, nerd: 0 }
    );

    return [
      {
        name: quizData.categories.cringe[language],
        score: scores.cringe,
        maxScore: maxScores.cringe,
        color: "hsl(25, 95%, 53%)",
      },
      {
        name: quizData.categories.toxic[language],
        score: scores.toxic,
        maxScore: maxScores.toxic,
        color: "hsl(0, 72%, 51%)",
      },
      {
        name: quizData.categories.pervers[language],
        score: scores.pervers,
        maxScore: maxScores.pervers,
        color: "hsl(300, 76%, 62%)",
      },
      {
        name: quizData.categories.nerd[language],
        score: scores.nerd,
        maxScore: maxScores.nerd,
        color: "hsl(189, 95%, 51%)",
      },
    ];
  };

  const getTotalScore = () => {
    return scores.cringe + scores.toxic + scores.pervers + scores.nerd;
  };

  const getMaxTotalScore = () => {
    if (!quizData) return 0;
    return quizData.questions.reduce(
      (acc, q) => acc + q.cringe + q.toxic + q.pervers + q.nerd,
      0
    );
  };

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">
          {language === "fr" ? "Chargement..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <>
      {screen !== "language" && (
        <LanguageSwitcher
          currentLanguage={language}
          onSwitch={handleLanguageSwitch}
        />
      )}

      {screen === "language" && (
        <LanguageSelector onSelectLanguage={handleLanguageSelect} />
      )}

      {screen === "quiz" && (
        <QuizQuestion
          question={quizData.questions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          totalQuestions={quizData.questions.length}
          language={language}
          onAnswer={handleAnswer}
        />
      )}

      {screen === "results" && (
        <QuizResults
          scores={getCategoryScores()}
          totalScore={getTotalScore()}
          maxTotalScore={getMaxTotalScore()}
          language={language}
          onRestart={handleRestart}
        />
      )}
    </>
  );
};

export default Index;
