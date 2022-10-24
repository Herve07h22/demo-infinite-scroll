export type Post = {
  id: number;
  title: string;
  body: string;
};

export interface Api {
  list: (take: number, from?: number) => Promise<Post[]>;
  save: (post: Post) => Promise<void>;
}
