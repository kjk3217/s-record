import { Student, ObservationRecord, GeneratedContent } from '../types';
import { MOCK_STUDENTS } from '../constants';

// Keys
const STUDENTS_KEY = 'ai_records_students';
const RECORDS_KEY = 'ai_records_data';
const GENERATED_KEY = 'ai_records_generated';

// Initial Setup
const initStorage = () => {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(MOCK_STUDENTS));
  }
  if (!localStorage.getItem(RECORDS_KEY)) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(GENERATED_KEY)) {
    localStorage.setItem(GENERATED_KEY, JSON.stringify([]));
  }
};

initStorage();

export const storage = {
  getStudents: (): Student[] => {
    return JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
  },
  
  addStudent: (student: Omit<Student, 'id'>) => {
    const students = storage.getStudents();
    const newStudent = { ...student, id: Date.now().toString() };
    students.push(newStudent);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students.sort((a, b) => a.number - b.number)));
    return newStudent;
  },
  
  // Bulk add for Excel upload
  addStudents: (newStudents: Omit<Student, 'id'>[]) => {
    const students = storage.getStudents();
    const timestamp = Date.now();
    const added = newStudents.map((s, i) => ({ ...s, id: `${timestamp}-${i}` }));
    const combined = [...students, ...added].sort((a, b) => a.number - b.number);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(combined));
    return combined;
  },

  getRecords: (category?: string): ObservationRecord[] => {
    const records = JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]');
    if (category) {
      return records.filter((r: ObservationRecord) => r.category === category);
    }
    return records;
  },

  saveRecord: (recordData: Omit<ObservationRecord, 'id' | 'createdAt'>) => {
    const records: ObservationRecord[] = storage.getRecords();
    // Check if update or create based on studentId + category + subCategory
    const existingIndex = records.findIndex(
      r => r.studentId === recordData.studentId && 
           r.category === recordData.category && 
           r.subCategory === recordData.subCategory &&
           r.point === recordData.point
    );

    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      records[existingIndex] = { ...records[existingIndex], ...recordData };
    } else {
      records.push({
        ...recordData,
        id: Date.now().toString(),
        createdAt: now
      });
    }
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  },

  getGenerated: (): GeneratedContent[] => {
    return JSON.parse(localStorage.getItem(GENERATED_KEY) || '[]');
  },

  saveGenerated: (content: Omit<GeneratedContent, 'id' | 'createdAt'>) => {
    const list = storage.getGenerated();
    const newItem = { ...content, id: Date.now().toString(), createdAt: new Date().toISOString() };
    list.unshift(newItem); // Add to top
    localStorage.setItem(GENERATED_KEY, JSON.stringify(list));
    return newItem;
  }
};