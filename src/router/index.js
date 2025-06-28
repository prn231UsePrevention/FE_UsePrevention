import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CommunityProgramsView from '../views/CommunityProgramsView.vue'

import MyParticipationView from '../views/MyParticipationView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // No meta.requiresAuth here, HomeView handles content based on auth state
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true } // For guests only
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true } // For guests only
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CourseProgramsView.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/courses/:id',
    name: 'course-detail',
    component: () => import('../views/CourseDetailView.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/community-programs',
    name: 'community-programs',
    component: CommunityProgramsView,
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/my-participations',
    name: 'my-participations',
    component: MyParticipationView,
    meta: { requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/surveys',
    name: 'surveys',
    component: () => import('../views/SurveyView.vue'),
    meta: { requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/consultants',
    name: 'consultants',
    component: () => import('../views/ConsultantBookingView.vue'),
    meta: { requiresAuth: true, roles: ['user'] }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/UserInformationView.vue'),
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('../views/BlogPostDetailView.vue'),
    // No requiresAuth, as blog posts are public
  },
  // Admin Routes
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, roles: ['admin'] } // Admin dashboard
  },
  {
    path: '/admin/community-programs',
    name: 'admin-community-programs',
    component: () => import('../views/AdminCommunityProgramsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/surveys',
    name: 'admin-surveys',
    component: () => import('../views/AdminSurveysView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/consultants',
    name: 'admin-consultants',
    component: () => import('../views/AdminConsultantsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/courses',
    name: 'admin-courses',
    component: () => import('../views/AdminCoursesView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/courses/create',
    name: 'course-create',
    component: () => import('../views/CourseCreateView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/admin/courses/edit/:id',
    name: 'course-edit',
    component: () => import('../views/CourseEditView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
  const userRole = authStore.userRole

  const requiresAuth = to.meta.requiresAuth
  const guestOnly = to.meta.guest
  const requiredRoles = to.meta.roles

  // Redirect away from guest pages if logged in
  if (guestOnly && isLoggedIn) {
    if (userRole && userRole === 'admin') {
      return next({ name: 'admin-dashboard' })
    }
    return next({ name: 'home' })
  }

  // Redirect to login if trying to access a protected page and not logged in
  if (requiresAuth && !isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Check for role authorization if logged in and accessing a protected page
  if (requiresAuth && isLoggedIn) {
    // If user has an invalid role (e.g. null), log them out.
    if (!userRole) {
      authStore.logout()
      return // The logout action will redirect to /login
    }
    
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      // Role is not authorized for this route. Redirect to their home page.
      if (userRole === 'admin') {
        return next({ name: 'admin-dashboard' })
      }
      return next({ name: 'home' })
    }
  }

  // If all checks pass, proceed with navigation
  next()
})

export default router
