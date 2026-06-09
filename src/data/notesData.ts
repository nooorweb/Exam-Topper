/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NoteTopic {
  id: string;
  subject: 'English' | 'General Knowledge' | 'Pakistan Studies' | 'Computer Science' | 'Mathematics' | 'Islamiat';
  title: string;
  overview: string;
  content: string;
  keyPoints: string[];
  formulas?: { name: string; equation: string; application: string }[];
  tables?: { headers: string[]; rows: string[][] }[];
  importance: 'high' | 'medium' | 'critical';
  estimatedReadTime: number; // in minutes
  examTargets?: string[]; // Tagged exams this topic is relevant for
}

export interface SubjectNotebook {
  subject: 'English' | 'General Knowledge' | 'Pakistan Studies' | 'Computer Science' | 'Mathematics' | 'Islamiat';
  iconName: string;
  description: string;
  topics: NoteTopic[];
}

export const SUBJECT_NOTEBOOKS: SubjectNotebook[] = [];
