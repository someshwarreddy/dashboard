export interface UserRoleReport {
  _id: 'admin' | 'user';
  count: number;
}

export interface RegistrationTrend {
  _id: string; // YYYY-MM-DD
  count: number;
}

export interface UserReport {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  legacyUsers: number;
  usersByRole: UserRoleReport[];
  registrationsOverTime: RegistrationTrend[];
}