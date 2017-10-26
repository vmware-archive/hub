export class Star {
  id: string;
  type: string;
  stargazers_count: number;
  has_starred: boolean;

  constructor(opts: any = {}) {
    if (opts.id) this.id = opts.id;
    this.stargazers_count = 0;
  }
}
