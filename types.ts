export interface GenerationResult {
  script: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageFile {
  preview: string; // Base64 data URL
  file?: File;
}
