export class Comment {
  id: string;
  text: string;
  created_at: Date;
  author: CommentAuthor;
}

export class CommentAuthor {
  id: string;
  name: string;
  avatar_url: string;
}
