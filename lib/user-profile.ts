export type UserProfile = {
  age_group: string | null;
  gender: string | null;
  travel_experience: string | null;
  travel_style: {
    active_time: string | null;
    pace: string | null;
    interests: string[];
    dislikes: string[];
  };
  food: {
    preferences: string[];
    allergies: string[];
    restrictions_note: string;
  };
  budget: {
    range: string | null;
    priority: string | null;
  };
  companion: string | null;
};

export const PROFILE_KEY = "user_profile";
export const ONBOARDING_KEY = "onboarding_complete";

/** デフォルト値込みの空プロフィール */
export const emptyProfile: UserProfile = {
  age_group: null,
  gender: null,
  travel_experience: null,
  travel_style: {
    active_time: "either",   // デフォルト: どちらでも
    pace: "standard",        // デフォルト: 標準
    interests: [],
    dislikes: [],
  },
  food: {
    preferences: [],
    allergies: [],
    restrictions_note: "",
  },
  budget: {
    range: null,
    priority: "balanced",    // デフォルト: バランス重視
  },
  companion: null,
};

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}
