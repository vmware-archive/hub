import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommentsService } from '../../shared/services/comments.service';
import { Comment } from '../../shared/models/comment';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-chart-details-comments',
  templateUrl: './chart-details-comments.component.html',
  styleUrls: ['./chart-details-comments.component.scss']
})
export class ChartDetailsCommentsComponent implements OnInit {
  loggedIn: boolean = false;
  user: any = {};
  comment: Comment = new Comment();
  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private cookieService: CookieService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.loggedIn().subscribe(loggedIn => { this.loggedIn = loggedIn; });
    let userClaims = this.cookieService.get("ka_claims");
    if (userClaims) {
      this.user = JSON.parse(atob(userClaims));
    }
    this.getComments();
  }

  getComments() {
    this.route.params.forEach((params: Params) => {
      let repo = params['repo'];
      let chartName = params['chartName'];
      this.commentsService.getComments(repo, chartName).subscribe(comments => {
        this.comments = comments.sort(this.sortByCreated).reverse();
      });
    });
  }

  createComment() {
    this.route.params.forEach((params: Params) => {
      let repo = params['repo'];
      let chartName = params['chartName'];
      this.commentsService.createComment(repo, chartName, this.comment).subscribe(comment => {
        this.comments.unshift(comment);
        this.comment.text = "";
      });
    });
  }

  sortByCreated(a: Comment, b: Comment) {
    if (a.created_at < b.created_at) {
      return -1;
    } else if (a.created_at > b.created_at) {
      return 1;
    }
    return 0;
  }
}
