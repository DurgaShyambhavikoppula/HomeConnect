export type UserType = "renter" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  approved: boolean;
}

export interface Property {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  propertyType: string;
  propertyAdType: string;
  propertyAddress: string;
  propertyAmt: number;
  propertyImage: string;
  furnishingStatus: string;
  additionalInfo: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  userId: string;
  userName: string;
  phone: string;
  bookingStatus: "pending" | "confirmed" | "cancelled";
  bookingDate: string;
  visitDate?: string;
  message?: string;
}
