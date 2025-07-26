import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule,HttpClientModule],
  providers: [UserService]
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  loading: boolean = true;
  error: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.error = 'Invalid user ID';
      this.loading = false;
      return;
    }

    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.error = 'Failed to load user details';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getFullAddress(): string {
    if (!this.user) return '';
    const addr = this.user.address;
    return `${addr.street}, ${addr.suite}, ${addr.city}, ${addr.zipcode}`;
  }
}
