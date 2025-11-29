export interface Review {
  id: string;
  text: string;
  label: "positive" | "neutral" | "negative";
  confidence: number;
  src?: string;
}

export interface Group {
  id: string;
  name: string;
  date: string;
  reviews?: Review[] | null;
  generalScore?: number;
  reviewCount?: number;
}

export interface GroupsResponse {
  result: Group[];
  errorMessage: string | null;
  timeGenerated: string;
}

export interface ReviewRequest {
  review: string;
}

export interface ReviewResponse {
  id: string;
  text: string;
  label: "positive" | "neutral" | "negative";
  confidence: number;
  groupId: string;
}

export interface FileUploadResponse {
  result: "Success" | "Error";
  errorMessage: string | null;
  timeGenerated: string;
}
