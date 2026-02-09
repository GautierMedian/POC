export interface ColumnMapping {
  csvColumn: string;
  schemaColumn: string | null;
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export const PREDEFINED_SCHEMA: SchemaField[] = [
  { name: 'protocol_id', type: 'string', required: true, description: 'Identifiant du protocole' },
  { name: 'project_id', type: 'string', required: true, description: 'Code du projet' },
  { name: 'site', type: 'string', required: true, description: 'Site' },
  { name: 'subject', type: 'string', required: true, description: 'Sujet' },
  { name: 'date', type: 'date', required: false, description: 'Date' },
  { name: 'modality', type: 'string', required: false, description: 'Modalité' },
  { name: 'visit', type: 'string', required: false, description: 'Visite' },
  { name: 'anatomy', type: 'string', required: false, description: 'Anatomie' },
  { name: 'patient_status', type: 'string', required: false, description: 'Statut du patient' },
  { name: 'img_reception_status', type: 'string', required: false, description: 'Statut de réception image' },
  { name: 'tp_img_reception_status', type: 'string', required: false, description: 'Statut TP réception image' },
  { name: 'img_ecrf_recon_status', type: 'string', required: false, description: 'Statut réconciliation image eCRF' },
  { name: 'image_date_deviation', type: 'string', required: false, description: 'Déviation date image' },
  { name: 'image_modality_deviation', type: 'string', required: false, description: 'Déviation modalité image' },
  { name: 'image_visitname_deviation', type: 'string', required: false, description: 'Déviation nom de visite image' },
  { name: 'image_organ_deviation', type: 'string', required: false, description: 'Déviation organe image' },
  { name: 'image_contrast_deviation', type: 'string', required: false, description: 'Déviation contraste image' },
  { name: 'tp_query_recon_status', type: 'string', required: false, description: 'Statut requête de réconciliation TP' },
  { name: 'tp_img_ecrf_recon_action', type: 'string', required: false, description: 'Action réconciliation TP image eCRF' },
  { name: 'visit_ecrf', type: 'string', required: false, description: 'Visite eCRF' },
  { name: 'visit_median', type: 'string', required: false, description: 'Visite médiane' },
  { name: 'mod_ecrf', type: 'string', required: false, description: 'Modalité eCRF' },
  { name: 'mod_median', type: 'string', required: false, description: 'Modalité médiane' },
  { name: 'date_ecrf', type: 'date', required: false, description: 'Date eCRF' },
  { name: 'date_median', type: 'date', required: false, description: 'Date médiane' },
  { name: 'anatomy_ecrf', type: 'string', required: false, description: 'Anatomie eCRF' },
  { name: 'anatomy_median', type: 'string', required: false, description: 'Anatomie médiane' },
  { name: 'tp_img_ecrf_recon_status', type: 'string', required: false, description: 'Statut réconciliation TP image eCRF' },
  { name: 'settings_visit', type: 'string', required: false, description: 'Paramètres de visite' },
  { name: 'settings_contrast', type: 'string', required: false, description: 'Paramètres de contraste' },
  { name: 'settings_anatomy', type: 'string', required: false, description: 'Paramètres anatomie' },
  { name: 'settings_single_data_per_tp', type: 'string', required: false, description: 'Paramètre donnée unique par TP' },
  { name: 'tp_img_im_qc_status', type: 'string', required: false, description: 'Statut QC image TP' },
  { name: 'ecrf_extract_date', type: 'date', required: false, description: 'Date extraction eCRF' },
  { name: 'modality_orp', type: 'string', required: false, description: 'Modalité ORP' },
  { name: 'first_rec_date', type: 'date', required: false, description: 'Date première réception' }
];
