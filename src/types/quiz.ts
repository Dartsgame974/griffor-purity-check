export interface Question {
  fr: string;
  en: string;
  cringe: number;
  toxic: number;
  pervers: number;
  nerd: number;
}

export interface Categories {
  cringe: { fr: string; en: string };
  toxic: { fr: string; en: string };
  pervers: { fr: string; en: string };
  nerd: { fr: string; en: string };
}

export interface QuizData {
  categories: Categories;
  questions: Question[];
}

export type Language = "fr" | "en";

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  color: string;
}
