import React from 'react';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  in: 'path' | 'query' | 'header' | 'body';
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: any;
}

export interface ApiEndpoint {
  id: string;
  method: Method;
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: ApiParameter[];
  requestBody?: any;
  responses: ApiResponse[];
  isAiPowered?: boolean; // To flag endpoints that use Gemini in the simulator
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
}