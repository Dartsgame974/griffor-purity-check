export interface QuestionVote {
  question_id: number;
  cringe: number;
  toxic: number;
  pervers: number;
  nerd: number;
}

export interface UserVote {
  user_id: string;
  date: string;
  votes: QuestionVote[];
}

export interface QuestionAverage {
  question_id: number;
  average: {
    cringe: number;
    toxic: number;
    pervers: number;
    nerd: number;
  };
  count: number;
}

export interface CommunityRatings {
  votes: QuestionAverage[];
}

export interface CategoryVotes {
  yes: number;
  no: number;
}

export interface CategoryFeedback {
  categories: {
    cringe: CategoryVotes;
    toxic: CategoryVotes;
    pervers: CategoryVotes;
    nerd: CategoryVotes;
  };
}
