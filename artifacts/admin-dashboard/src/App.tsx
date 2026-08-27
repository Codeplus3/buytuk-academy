import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Dashboard } from '@/pages/Dashboard';
import { TenantsList } from '@/pages/TenantsList';
import { TenantDetail } from '@/pages/TenantDetail';
import { SchoolsList } from '@/pages/SchoolsList';
import { SchoolDetail } from '@/pages/SchoolDetail';
import { UsersList } from '@/pages/UsersList';
import { RolesPage } from '@/pages/RolesPage';
import { AssessmentsList } from '@/pages/AssessmentsList';
import { SubmissionsList } from '@/pages/SubmissionsList';
import { InterventionsList } from '@/pages/InterventionsList';
import { ReferralsList } from '@/pages/ReferralsList';
import { EvidencePage } from '@/pages/EvidencePage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AppRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tenants" component={TenantsList} />
        <Route path="/tenants/:id" component={TenantDetail} />
        <Route path="/schools" component={SchoolsList} />
        <Route path="/schools/:id" component={SchoolDetail} />
        <Route path="/users" component={UsersList} />
        <Route path="/roles" component={RolesPage} />
        <Route path="/assessments" component={AssessmentsList} />
        <Route path="/submissions" component={SubmissionsList} />
        <Route path="/interventions" component={InterventionsList} />
        <Route path="/referrals" component={ReferralsList} />
        <Route path="/evidence" component={EvidencePage} />
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
