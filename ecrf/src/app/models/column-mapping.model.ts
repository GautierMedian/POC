export interface ColumnMapping {
  csvColumn: string;
  schemaColumn: string | null;
}

export interface SchemaField {
  name: string;
  field?: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface StudySchema {
  name: string;
  fields: SchemaField[];
}

export interface ValidationError {
  rowIndex: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export const PREDEFINED_SCHEMAS: Record<string, SchemaField[]> = {
  'ROCH-PH-063': [
    { name: 'Study ID', type: 'string', required: true, description: 'Study ID' },
    { name: 'Vendor Name', type: 'string', required: true, description: 'Vendor Name' },
    { name: 'Country', type: 'string', required: true, description: 'Country' },
    { name: 'Site Number', type: 'string', required: true, description: 'Site Number' },
    { name: 'Subject', type: 'string', required: true, description: 'Subject' },
    { name: 'Visit', type: 'string', required: false, description: 'Visit' },
    { name: 'Unique Image Identifier', type: 'string', required: false, description: 'Unique Image Identifier' },
    { name: 'Modality', type: 'string', required: false, description: 'Modality' },
    { name: 'Anatomy on Image', type: 'string', required: false, description: 'Anatomy on Image' },
    { name: 'Scan Date', type: 'date', required: false, description: 'Scan Date' },
    { name: 'Image Processing Status', type: 'string', required: false, description: 'Image Processing Status' },
    { name: 'Rolling Read Trigger', type: 'string', required: false, description: 'Rolling Read Trigger' },
    { name: 'Last Transfer Date', type: 'date', required: false, description: 'Last Transfer Date' },
    { name: 'Run Date', type: 'date', required: false, description: 'Run Date' }
  ],
  'SIGN-PH-002': [
    { name: 'STUDYID', type: 'string', required: true, description: 'Study ID' },
    { name: 'SITENUM', type: 'string', required: true, description: 'Site Number' },
    { name: 'SUBNUM', type: 'string', required: true, description: 'Subject Number' },
    { name: 'IEYN', type: 'string', required: false, description: 'IE Yes/No' },
    { name: 'VISNAME', type: 'string', required: false, description: 'Visit Name' },
    { name: 'VISDAT', type: 'date', required: false, description: 'Visit Date' },
    { name: 'TLDAT', type: 'date', required: false, description: 'TL Date' },
    { name: 'TLMETHOD', type: 'string', required: false, description: 'TL Method' }
  ]
};

// Pour la rétrocompatibilité
export const PREDEFINED_SCHEMA: SchemaField[] = PREDEFINED_SCHEMAS['ROCH-PH-063'];
