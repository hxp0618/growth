export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
}

export type RootStackParamList = {
  '(tabs)': undefined;
  modal: undefined;
  settings: undefined;
};

export type TabParamList = {
  index: undefined;
  charts: undefined;
  calendar: undefined;
  profile: undefined;
};