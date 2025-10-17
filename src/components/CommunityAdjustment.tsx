import { useState, useEffect } from "react";
import { Language, Question } from "@/types/quiz";
import { CommunityRatings, CategoryFeedback, QuestionVote, UserVote } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface CommunityAdjustmentProps {
  questions: Question[];
  language: Language;
  onBack: () => void;
}

const CommunityAdjustment = ({ questions, language, onBack }: CommunityAdjustmentProps) => {
  const [communityRatings, setCommunityRatings] = useState<CommunityRatings | null>(null);
  const [categoryFeedback, setCategoryFeedback] = useState<CategoryFeedback | null>(null);
  const [userVotes, setUserVotes] = useState<QuestionVote[]>([]);
  const [categoryVotes, setCategoryVotes] = useState<{ [key: string]: boolean | null }>({
    cringe: null,
    toxic: null,
    pervers: null,
    nerd: null,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [userId] = useState(() => {
    const stored = localStorage.getItem("valopurity_user_id");
    if (stored) return stored;
    const newId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("valopurity_user_id", newId);
    return newId;
  });

  useEffect(() => {
    loadCommunityData();
    checkVoteCooldown();
    initializeUserVotes();
  }, []);

  const loadCommunityData = async () => {
    try {
      const [ratingsRes, feedbackRes] = await Promise.all([
        fetch("/community_ratings.json"),
        fetch("/category_feedback.json"),
      ]);

      if (ratingsRes.ok) {
        const ratings = await ratingsRes.json();
        setCommunityRatings(ratings);
      }

      if (feedbackRes.ok) {
        const feedback = await feedbackRes.json();
        setCategoryFeedback(feedback);
      }
    } catch (error) {
      console.error("Error loading community data:", error);
    }
  };

  const checkVoteCooldown = () => {
    const lastVote = localStorage.getItem("valopurity_last_vote");
    if (lastVote) {
      const lastVoteTime = new Date(lastVote).getTime();
      const now = Date.now();
      const hoursPassed = (now - lastVoteTime) / (1000 * 60 * 60);
      if (hoursPassed < 72) {
        setHasVoted(true);
      }
    }
  };

  const initializeUserVotes = () => {
    const initialVotes = questions.map((q, index) => ({
      question_id: index + 1,
      cringe: q.cringe,
      toxic: q.toxic,
      pervers: q.pervers,
      nerd: q.nerd,
    }));
    setUserVotes(initialVotes);
  };

  const handleSliderChange = (questionId: number, category: string, value: number[]) => {
    setUserVotes((prev) =>
      prev.map((vote) =>
        vote.question_id === questionId ? { ...vote, [category]: value[0] } : vote
      )
    );
  };

  const handleCategoryVote = (category: string, vote: boolean) => {
    setCategoryVotes((prev) => ({ ...prev, [category]: vote }));
  };

  const handleSubmit = () => {
    if (hasVoted) {
      toast.error(
        language === "fr"
          ? "Tu as déjà voté récemment. Attends 72 heures."
          : "You've already voted recently. Wait 72 hours."
      );
      return;
    }

    const voteData: UserVote = {
      user_id: userId,
      date: new Date().toISOString().split("T")[0],
      votes: userVotes,
    };

    // Create downloadable file
    const dataStr = JSON.stringify(voteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vote_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Store vote timestamp
    localStorage.setItem("valopurity_last_vote", new Date().toISOString());
    setHasVoted(true);

    toast.success(
      language === "fr"
        ? "Merci pour ta contribution !"
        : "Thanks for your contribution!"
    );
  };

  const getAverageForQuestion = (questionId: number) => {
    if (!communityRatings) return null;
    return communityRatings.votes.find((v) => v.question_id === questionId);
  };

  const getCategoryPercentage = (category: string) => {
    if (!categoryFeedback) return { yes: 0, total: 0 };
    const feedback = categoryFeedback.categories[category as keyof typeof categoryFeedback.categories];
    const total = feedback.yes + feedback.no;
    return { yes: total > 0 ? (feedback.yes / total) * 100 : 0, total };
  };

  const introText = {
    fr: {
      title: "Ceci est une première version.",
      description: [
        "Les scores actuels ont été établis par Dartsgame.",
        "Les valeurs ont besoin d'être réajustées avec une grande audience.",
        "En haut, tu verras les scores de base, la moyenne actuelle des joueurs, et ta propre contribution.",
        "Ton vote aidera à calculer une moyenne plus juste pour les prochaines versions du test.",
      ],
    },
    en: {
      title: "This is a first version.",
      description: [
        "The current scores were set by Dartsgame.",
        "These values need to be refined with a larger audience.",
        "At the top, you'll see the base scores, the current player averages, and your personal feedback area.",
        "Your input helps create fairer, more accurate scoring for future versions.",
      ],
    },
  };

  const text = introText[language];

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button onClick={onBack} variant="outline" className="mb-8">
          ← {language === "fr" ? "Retour aux résultats" : "Back to results"}
        </Button>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-card border border-border rounded-xl">
          <h2 className="text-3xl font-bold mb-4 text-primary">{text.title}</h2>
          <div className="space-y-2 text-muted-foreground">
            {text.description.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* Question Adjustments */}
        <div className="space-y-8 mb-12">
          <h3 className="text-2xl font-bold">
            {language === "fr" ? "Réajustement des questions" : "Question Adjustments"}
          </h3>

          {questions.map((question, index) => {
            const questionId = index + 1;
            const userVote = userVotes.find((v) => v.question_id === questionId);
            const average = getAverageForQuestion(questionId);

            return (
              <div key={questionId} className="p-6 bg-card border border-border rounded-xl">
                <h4 className="text-lg font-semibold mb-6">
                  {questionId}. {question[language]}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(["cringe", "toxic", "pervers", "nerd"] as const).map((category) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold capitalize text-sm">{category}</span>
                      </div>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>{language === "fr" ? "Base" : "Base"}:</span>
                          <span className="font-mono">{question[category]}</span>
                        </div>
                        {average && (
                          <div className="flex justify-between">
                            <span>{language === "fr" ? "Moyenne" : "Average"}:</span>
                            <span className="font-mono">
                              {average.average[category].toFixed(1)} ({average.count} votes)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={10}
                          step={1}
                          value={[userVote?.[category] || 0]}
                          onValueChange={(value) => handleSliderChange(questionId, category, value)}
                          disabled={hasVoted}
                        />
                        <div className="text-center font-mono text-sm">
                          {userVote?.[category] || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Feedback */}
        <div className="space-y-6 mb-12">
          <h3 className="text-2xl font-bold">
            {language === "fr"
              ? "Sondage sur les catégories"
              : "Category Feedback"}
          </h3>

          {(["cringe", "toxic", "pervers", "nerd"] as const).map((category) => {
            const percentage = getCategoryPercentage(category);
            const voted = categoryVotes[category];

            return (
              <div key={category} className="p-6 bg-card border border-border rounded-xl">
                <h4 className="text-lg font-semibold mb-4 capitalize">
                  {language === "fr"
                    ? `Trouves-tu que "${category}" est une bonne catégorie ?`
                    : `Do you think "${category}" is a good category?`}
                </h4>

                <div className="flex gap-4 mb-4">
                  <Button
                    onClick={() => handleCategoryVote(category, true)}
                    variant={voted === true ? "default" : "outline"}
                    disabled={hasVoted}
                    className="flex-1"
                  >
                    {language === "fr" ? "Oui" : "Yes"}
                  </Button>
                  <Button
                    onClick={() => handleCategoryVote(category, false)}
                    variant={voted === false ? "default" : "outline"}
                    disabled={hasVoted}
                    className="flex-1"
                  >
                    {language === "fr" ? "Non" : "No"}
                  </Button>
                </div>

                {percentage.total > 0 && (
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{language === "fr" ? "Oui" : "Yes"}: {percentage.yes.toFixed(1)}%</span>
                      <span>{percentage.total} {language === "fr" ? "votes" : "votes"}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${percentage.yes}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={hasVoted}
            className="px-12 glow-primary"
          >
            {hasVoted
              ? language === "fr"
                ? "Déjà voté (attends 72h)"
                : "Already voted (wait 72h)"
              : language === "fr"
              ? "Envoyer ma contribution"
              : "Submit my feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityAdjustment;
