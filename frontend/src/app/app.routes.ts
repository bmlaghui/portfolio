import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { BlogListComponent } from './pages/blog-list/blog-list';
import { BlogDetailComponent } from './pages/blog-detail/blog-detail';
import { AdminLoginComponent } from './admin/pages/login/login';
import { adminAuthGuard } from './admin/guards/admin-auth.guard';
import { ProjectDetailComponent } from './pages/project-detail/project-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'Home' } },
  { path: 'blog', component: BlogListComponent, data: { animation: 'Blog' } },
  { path: 'blog/:slug', component: BlogDetailComponent, data: { animation: 'BlogDetail' } },
  { path: 'projects/:slug', component: ProjectDetailComponent, data: { animation: 'ProjectDetail' } },
  { path: 'cv', loadComponent: () => import('./pages/resume/resume').then(m => m.ResumeComponent), data: { animation: 'Resume' } },
  
  // Admin routes
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout/admin-layout').then(m => m.AdminLayoutComponent),
    canActivate: [adminAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./admin/pages/dashboard/dashboard').then(m => m.AdminDashboardComponent) 
      },
      { 
        path: 'projects', 
        loadComponent: () => import('./admin/pages/projects/projects').then(m => m.AdminProjectsComponent) 
      },
      { 
        path: 'experience', 
        loadComponent: () => import('./admin/pages/experience/experience').then(m => m.AdminExperienceComponent) 
      },
      { 
        path: 'skills', 
        loadComponent: () => import('./admin/pages/skills/skills').then(m => m.AdminSkillsComponent) 
      },
      { 
        path: 'messages', 
        loadComponent: () => import('./admin/pages/messages/messages').then(m => m.AdminMessagesComponent) 
      },
      { 
        path: 'blog', 
        loadComponent: () => import('./admin/pages/blog/blog').then(m => m.AdminBlogComponent) 
      },
      { 
        path: 'education', 
        loadComponent: () => import('./admin/pages/education/education').then(m => m.AdminEducationComponent) 
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./admin/pages/profile/profile').then(m => m.AdminProfileComponent) 
      },
      {
        path: 'account',
        loadComponent: () => import('./admin/pages/account/account').then(m => m.AdminAccountComponent)
      },
      { path: 'testimonials', loadComponent: () => import('./admin/pages/testimonials/testimonials').then(m => m.AdminTestimonialsComponent) },
      { path: 'audience', loadComponent: () => import('./admin/pages/audience/audience').then(m => m.AdminAudienceComponent) }
    ]
  },

  { path: '**', redirectTo: '' }
];
