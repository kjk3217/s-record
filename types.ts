export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Student {
  id: string;
  classId: string; // e.g., "1-1"
  number: number;
  name: string;
  status?: 'recorded' | 'partial' | 'none'; // UI helper
}

export interface ObservationRecord {
  id: string;
  studentId: string;
  category: string;
  subCategory: string;
  point: string;
  checkedExamples: number[]; // indices of examples
  memo: string;
  createdAt: string;
}

export interface GeneratedContent {
  id: string;
  studentId: string;
  category: string;
  content: string;
  charCount: number;
  style: string;
  createdAt: string;
}

export interface ExampleCategory {
  [key: string]: {
    [key: string]: {
      [key: string]: string[];
    };
  };
}

export interface CategoryStructure {
  [key: string]: {
    [key: string]: string[];
  };
}