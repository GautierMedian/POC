export interface ColumnMapping {
  csvColumn: string;
  schemaColumn: string | null;
}

export interface SchemaField {
  name: string;
  label: string;
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
    { name: 'Study ID', label: 'ClinicalTrialProtocolID', type: 'string', required: true, description: 'Study ID' },
    { name: 'Vendor Name', label: 'Manufacturer', type: 'string', required: true, description: 'Vendor Name' },
    { name: 'Country', label: 'InstitutionAddress', type: 'string', required: true, description: 'Country' },
    { name: 'Site Number', label: 'ClinicalTrialSiteID', type: 'string', required: true, description: 'Site Number' },
    { name: 'Subject', label: 'ClinicalTrialSubjectID', type: 'string', required: true, description: 'Subject' },
    { name: 'Visit', label: 'ClinicalTrialTimePointID', type: 'string', required: false, description: 'Visit' },
    { name: 'Unique Image Identifier', label: 'SOPInstanceUID', type: 'string', required: false, description: 'Unique Image Identifier' },
    { name: 'Modality', label: 'Modality', type: 'string', required: false, description: 'Modality' },
    { name: 'Anatomy on Image', label: 'BodyPartExamined', type: 'string', required: false, description: 'Anatomy on Image' },
    { name: 'Scan Date', label: 'StudyDate', type: 'date', required: false, description: 'Scan Date' },
    { name: 'Image Processing Status', label: 'ImageType', type: 'string', required: false, description: 'Image Processing Status' },
    { name: 'Rolling Read Trigger', label: 'ClinicalTrialTimePointDescription', type: 'string', required: false, description: 'Rolling Read Trigger' },
    { name: 'Last Transfer Date', label: 'InstanceCreationDate', type: 'date', required: false, description: 'Last Transfer Date' },
    { name: 'Run Date', label: 'AcquisitionDate', type: 'date', required: false, description: 'Run Date' }
  ],
  'SIGN-PH-002': [
    { name: 'STUDYID', label: 'ClinicalTrialProtocolID', type: 'string', required: true, description: 'Study ID' },
    { name: 'SITENUM', label: 'ClinicalTrialSiteID', type: 'string', required: true, description: 'Site Number' },
    { name: 'SUBNUM', label: 'ClinicalTrialSubjectID', type: 'string', required: true, description: 'Subject Number' },
    { name: 'IEYN', label: 'ClinicalTrialSubjectReadingID', type: 'string', required: false, description: 'IE Yes/No' },
    { name: 'VISNAME', label: 'ClinicalTrialTimePointDescription', type: 'string', required: false, description: 'Visit Name' },
    { name: 'VISDAT', label: 'StudyDate', type: 'date', required: false, description: 'Visit Date' },
    { name: 'TLDAT', label: 'ContentDate', type: 'date', required: false, description: 'TL Date' },
    { name: 'TLMETHOD', label: 'ProtocolName', type: 'string', required: false, description: 'TL Method' }
  ]
};

// Pour la rétrocompatibilité
export const PREDEFINED_SCHEMA: SchemaField[] = PREDEFINED_SCHEMAS['ROCH-PH-063'];
