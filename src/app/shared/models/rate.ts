export class Star {
  id: string;
  type: string;
  stargazers_count: number;
  has_starred: boolean;

  constructor() {
    this.stargazers_count = 0;
  }
}
