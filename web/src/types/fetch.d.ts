export interface Weather {
  id: number;
  createdAt: string;
  text: string;
  description: string;
  temperature: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDirection: string;
  gust: number;
  rain: number;
  cloudCoverage: number;
  sunrise: string;
  sunset: string;
  timezone: string;
  key: string;
  mode: string;
  scale?: ScaleEntity[] | null;
  chord: Chord;
}

export interface ScaleEntity {
  step: number;
  note: string;
  relOctave: number;
}

export interface Chord {
  type: string;
  interval: string;
  notes?: NotesEntity[] | null;
}

export interface NotesEntity {
  note: string;
  relOctave: number;
}
