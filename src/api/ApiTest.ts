import { Api, Post } from "./Api";

export class ApiTest implements Api {
  _posts: Map<number, Post> = new Map();
  async list(take: number, from?: number) {
    const startId = (from || 0) + 1;
    if (startId > 20) return [];
    return new Array(take)
      .fill(null)
      .map((_, index) => ({
        id: startId + index,
        title: `Title #${startId + index}`,
        body: `Body #${startId + index}`,
      }))
      .map((post) => this._posts.get(post.id) || post);
  }
  async save(post: Post) {
    this._posts.set(post.id, post);
  }
}
