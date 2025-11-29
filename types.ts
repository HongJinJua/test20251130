export enum IceLevel {
  Regular = "Regular Ice",
  Less = "Less Ice",
  None = "No Ice",
  Hot = "Hot"
}

export enum SugarLevel {
  Regular = "100%",
  Less = "70%",
  Half = "50%",
  Little = "30%",
  None = "0%"
}

export interface DrinkItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string; // URL
}

export interface OrderItem {
  id: string;
  drinkId: string;
  drinkName: string;
  userName: string;
  price: number;
  ice: IceLevel;
  sugar: SugarLevel;
  timestamp: number;
}

export interface GroupOrder {
  id: string;
  hostName: string;
  groupName: string; // e.g. "Friday Boba Madness"
  status: 'OPEN' | 'LOCKED' | 'COMPLETED';
  createdAt: number;
  deadline?: string;
  orders: OrderItem[];
}

export type PageView = 'HOME' | 'CREATE_GROUP' | 'GROUP_DETAIL';