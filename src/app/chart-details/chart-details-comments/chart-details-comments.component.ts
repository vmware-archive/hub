import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommentsService } from '../../shared/services/comments.service';
import { Comment } from '../../shared/models/comment';
import { MatDialogRef, MatDialog, MatDialogConfig, MatIconRegistry, MatSnackBar } from '@angular/material';
import { DialogsService } from '../../shared/services/dialogs.service';
import { DomSanitizer } from '@angular/platform-browser';
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
    private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dialogsService: DialogsService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.mdIconRegistry.addSvgIcon(
      'delete',
      this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/delete.svg')
    );

    this.authService.loggedIn().subscribe(loggedIn => { this.loggedIn = loggedIn; });
    this.user = this.authService.getUser();
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
        this.getComments();
        this.comment.text = "";
      });
    });
  }

  deleteComment(commentID: string) {
    this.route.params.forEach((params: Params) => {
      let repo = params['repo'];
      let chartName = params['chartName'];

      this.dialogsService.confirm(
        `Delete comment`,
        'Are you sure you want to delete this comment?',
        'Yes',
        'Cancel'
      ).subscribe(res => {
        if (res) {
          this.commentsService.deleteComment(repo, chartName, commentID).subscribe(comment => {
            this.getComments()
          },
          error => {
            this.snackBar.open(
              `Error deleting the comment, please try later`,
              'close',
              { duration: 5000 }
            );
          });
        }
      });
    });
  }

  commentAuthorName(user: any) {
    return (user.name == "") ? "Anonymous" : user.name;
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
