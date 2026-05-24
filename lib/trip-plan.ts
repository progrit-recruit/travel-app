export type ItinerarySlot = {
  time: string;
  spot: string;
  duration: string;
  transport: string;
  cost: number;
  comment: string;
};

export type DayPlan = {
  day: number;
  title: string;
  slots: ItinerarySlot[];
};

export type Itinerary = {
  days: DayPlan[];
  hotel: { name: string; cost_per_night: number; nights: number };
  flight: { airline: string; cost: number; duration: string };
  total_cost: number;
  highlights: string[];
};

export type TripPlan = {
  // STEP 1
  selectedDestinations: string[];
  // STEP 2
  destination: string | null;
  tripType: string | null;
  tripDays: number;
  // STEP 3
  interests: string[];
  freeText: string;
  extractedSpots: string[];
  // STEP 4
  itinerary: Itinerary | null;
  // meta
  bookingConfirmed: boolean;
  confirmedAt?: string;
};

export const TRIP_PLAN_KEY = "current_trip_plan";
export const CONFIRMED_TRIP_KEY = "confirmed_trip";

export const emptyTripPlan: TripPlan = {
  selectedDestinations: [],
  destination: null,
  tripType: null,
  tripDays: 5,
  interests: [],
  freeText: "",
  extractedSpots: [],
  itinerary: null,
  bookingConfirmed: false,
};

export function saveTripPlan(plan: TripPlan): void {
  localStorage.setItem(TRIP_PLAN_KEY, JSON.stringify(plan));
}

export function loadTripPlan(): TripPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TRIP_PLAN_KEY);
    return raw ? (JSON.parse(raw) as TripPlan) : null;
  } catch {
    return null;
  }
}

export function confirmTrip(plan: TripPlan): void {
  localStorage.setItem(
    CONFIRMED_TRIP_KEY,
    JSON.stringify({ ...plan, bookingConfirmed: true, confirmedAt: new Date().toISOString() })
  );
  localStorage.removeItem(TRIP_PLAN_KEY);
}

export function loadConfirmedTrip(): (TripPlan & { confirmedAt: string }) | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONFIRMED_TRIP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearTripPlan(): void {
  localStorage.removeItem(TRIP_PLAN_KEY);
}
