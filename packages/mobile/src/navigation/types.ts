export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Browse: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

export type BrowseStackParamList = {
  TrainerList: undefined;
  TrainerDetail: { trainerId: string };
  BookSession: { trainerId: string };
};

export type DashboardStackParamList = {
  MyBookings: undefined;
  BookingRequests: undefined;
  SessionDetail: { sessionId: string };
};

export type ProfileStackParamList = {
  ProfileView: undefined;
  EditProfile: undefined;
  Settings: undefined;
};
