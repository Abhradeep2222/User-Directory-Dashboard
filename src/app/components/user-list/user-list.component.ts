import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,HttpClientModule],
  providers: [UserService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  sortKey: 'name' | 'company' = 'name';
  sortAsc: boolean = true;
  user: User | null = null;

  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  applyFilters(): void {
    // Filter by search term
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Sort users
    this.filteredUsers.sort((a, b) => {
      let aKey = this.sortKey === 'name' ? a.name.toLowerCase() : a.company.name.toLowerCase();
      let bKey = this.sortKey === 'name' ? b.name.toLowerCase() : b.company.name.toLowerCase();

      if (aKey < bKey) return this.sortAsc ? -1 : 1;
      if (aKey > bKey) return this.sortAsc ? 1 : -1;
      return 0;
    });

    // Update pagination
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  toggleSort(key: 'name' | 'company'): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  getSortIcon(key: 'name' | 'company'): string {
    if (this.sortKey !== key) return '↕️';
    return this.sortAsc ? '↑' : '↓';
  }

  // Pagination methods
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  navigateToUser(userId: number): void {
    this.router.navigate(['/users', userId]);
  }
}
