export interface User {
  userId: number;
  username: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  role: string;
  bio?: string;
  email?: string;
  dateJoined?: string;
  banned?: boolean;
}

export interface Topic {
  topicName: string;
}

export interface Tag {
  tagName: string;
}

export interface UserComment {
  id: number;
  articleId: number;
  authorId: number;
  content: string;
  rating: number;
}

export interface Article {
  articleId: number;
  writer: User;
  topicName: string;
  tagsId?: number | null;
  releaseDate: string;
  content: string;
  status: string;
  title: string;
  imageUrl?: string;
  comments: UserComment[];
  tags: Tag[];
}
