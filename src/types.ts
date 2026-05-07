export type PipelineType = 'Lead Qualification' | 'Inspection' | 'Production' | 'Finance' | 'General';

export interface Guide {
  id: string;
  title: string;
  description: string;
  publishedDate: string;
  status: 'published' | 'draft' | 'processing';
  thumbnailUrl: string;
  authorIds: string[];
  version?: string;
  views?: number;
  lastUpdated: string;
  pipeline?: PipelineType;
  customerName?: string;
}

export interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  participantAvatars: string[];
  transcript?: string;
  ownerEmail?: string;
}

export interface Step {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  imageUrl: string;
}

export type ViewState = 'dashboard' | 'recordings' | 'editor' | 'queue' | 'library' | 'settings';
