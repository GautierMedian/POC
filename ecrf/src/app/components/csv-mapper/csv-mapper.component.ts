import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CsvParserService } from '../../services/csv-parser.service';
import { ColumnMapping, SchemaField, PREDEFINED_SCHEMA, PREDEFINED_SCHEMAS } from '../../models/column-mapping.model';

@Component({
  selector: 'app-csv-mapper',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    ScrollingModule
  ],
  templateUrl: './csv-mapper.component.html',
  styleUrl: './csv-mapper.component.css'
})
export class CsvMapperComponent implements OnInit {
  csvHeaders: string[] = [];
  csvData: any[] = [];
  columnMappings: ColumnMapping[] = [];
  predefinedSchema: SchemaField[] = [];
  schemaMap: Map<string, SchemaField> = new Map();
  fileName: string = '';
  isFileUploaded: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  mappingForm!: FormGroup;
  editingSchema: boolean = false;
  newSchemaField: string = '';
  csvDelimiter: string = ',';
  
  // Gestion des études
  availableStudies: string[] = Object.keys(PREDEFINED_SCHEMAS);
  selectedStudy: string = this.availableStudies[0];

  constructor(
    private csvParser: CsvParserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mappingForm = this.fb.group({});
    // Initialiser avec le schéma de l'étude sélectionnée
    this.loadSchemaForStudy(this.selectedStudy);
  }

  loadSchemaForStudy(studyName: string): void {
    this.predefinedSchema = [...PREDEFINED_SCHEMAS[studyName]];
    this.buildSchemaMap();
    
    // Si un fichier est déjà chargé, refaire le mapping automatique
    if (this.isFileUploaded) {
      this.remapColumns();
    }
  }

  onStudyChange(studyName: string): void {
    this.selectedStudy = studyName;
    this.loadSchemaForStudy(studyName);
  }

  private remapColumns(): void {
    // Réinitialiser les mappages avec le nouveau schéma
    this.columnMappings = this.csvHeaders.map(header => {
      const normalizedHeader = header.toLowerCase().trim();
      const matchingSchema = this.schemaMap.get(normalizedHeader);
      
      return {
        csvColumn: header,
        schemaColumn: matchingSchema ? matchingSchema.name : null
      };
    });
    
    // Mettre à jour les contrôles de formulaire
    this.columnMappings.forEach(mapping => {
      this.mappingForm.get(mapping.csvColumn)?.setValue(mapping.schemaColumn, { emitEvent: false });
    });
  }

  private buildSchemaMap(): void {
    this.schemaMap.clear();
    this.predefinedSchema.forEach(field => {
      this.schemaMap.set(field.name, field);
      this.schemaMap.set(field.name.toLowerCase(), field);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.csv')) {
      this.errorMessage = 'Veuillez sélectionner un fichier CSV';
      return;
    }

    this.fileName = file.name;
    this.errorMessage = '';
    this.isLoading = true;

    this.csvParser.parseCSV(file, this.csvDelimiter)
      .then(result => {
        this.csvHeaders = result.headers;
        this.csvData = result.data;
        this.isFileUploaded = true;
        
        // Initialiser les mappings avec auto-détection
        this.columnMappings = this.csvHeaders.map(header => {
          const normalizedHeader = header.toLowerCase().trim();
          const matchingSchema = this.schemaMap.get(normalizedHeader);
          
          return {
            csvColumn: header,
            schemaColumn: matchingSchema ? matchingSchema.name : null
          };
        });

        // Créer les contrôles de formulaire pour chaque colonne
        this.createFormControls();
        
        // Forcer la détection de changements
        this.cdr.detectChanges();
      })
      .catch(error => {
        this.errorMessage = error.message || 'Erreur lors du parsing du fichier CSV';
        console.error('Error parsing CSV:', error);
      })
      .finally(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  createFormControls(): void {
    // Créer le FormGroup avec les valeurs initialisées depuis columnMappings
    const controls: { [key: string]: any } = {};
    this.columnMappings.forEach(mapping => {
      controls[mapping.csvColumn] = this.fb.control(mapping.schemaColumn);
    });
    this.mappingForm = this.fb.group(controls);
  }

  onMappingChange(csvColumn: string, schemaColumn: string | null): void {
    const mapping = this.columnMappings.find(m => m.csvColumn === csvColumn);
    if (mapping) {
      mapping.schemaColumn = schemaColumn;
    }
  }

  getSchemaField(schemaName: string | null): SchemaField | undefined {
    if (!schemaName) return undefined;
    return this.schemaMap.get(schemaName);
  }

  validateMapping(): boolean {
    // Vérifier que tous les champs obligatoires sont mappés
    const requiredFields = this.predefinedSchema.filter(field => field.required);
    const mappedFields = this.columnMappings
      .filter(mapping => mapping.schemaColumn !== null)
      .map(mapping => mapping.schemaColumn);

    for (const required of requiredFields) {
      if (!mappedFields.includes(required.name)) {
        return false;
      }
    }

    return true;
  }

  submitMapping(): void {
    if (!this.validateMapping()) {
      this.errorMessage = 'Tous les champs obligatoires doivent être mappés';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simuler un délai pour la génération du fichier (optionnel)
    setTimeout(() => {
      // Créer le résultat du mapping
      const mappedData = this.csvData.map(row => {
        const mappedRow: any = {};
        
        this.columnMappings.forEach(mapping => {
          if (mapping.schemaColumn) {
            mappedRow[mapping.schemaColumn] = row[mapping.csvColumn];
          }
        });
        
        return mappedRow;
      });

      console.log('Mapping validé:', {
        mappings: this.columnMappings,
        mappedData: mappedData
      });

      // Télécharger le fichier CSV transformé
      this.downloadMappedCSV(mappedData);
      this.isLoading = false;
    }, 300);
  }

  downloadMappedCSV(data: any[]): void {
    if (data.length === 0) {
      this.errorMessage = 'Aucune donnée à télécharger';
      return;
    }

    // Récupérer les en-têtes des colonnes mappées
    const headers = this.columnMappings
      .filter(mapping => mapping.schemaColumn !== null)
      .map(mapping => mapping.schemaColumn as string);

    // Créer le contenu CSV
    let csvContent = headers.join(',') + '\n';

    // Ajouter les lignes de données
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Échapper les valeurs contenant des virgules ou des guillemets
        if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
          return '"' + value.toString().replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Créer un Blob et déclencher le téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'donnees_mappees_' + new Date().getTime() + '.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.errorMessage = '';
  }

  reset(): void {
    this.csvHeaders = [];
    this.csvData = [];
    this.columnMappings = [];
    this.fileName = '';
    this.isFileUploaded = false;
    this.errorMessage = '';
    this.mappingForm = this.fb.group({});
    // Ne pas réinitialiser le délimiteur pour garder le choix de l'utilisateur
    // Réinitialiser l'input file
    const fileInput = document.getElementById('csvFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  addSchemaField(): void {
    if (this.newSchemaField.trim()) {
      const newField = {
        name: this.newSchemaField.trim(),
        type: 'string',
        required: false,
        description: 'Champ personnalisé'
      };
      this.predefinedSchema.push(newField);
      // Ajouter au Map directement sans reconstruire tout
      this.schemaMap.set(newField.name, newField);
      this.schemaMap.set(newField.name.toLowerCase(), newField);
      this.newSchemaField = '';
    }
  }

  removeSchemaField(fieldName: string): void {
    this.predefinedSchema = this.predefinedSchema.filter(f => f.name !== fieldName);
    // Supprimer du Map
    this.schemaMap.delete(fieldName);
    this.schemaMap.delete(fieldName.toLowerCase());
    // Retirer les mappings qui utilisent ce champ
    this.columnMappings.forEach(mapping => {
      if (mapping.schemaColumn === fieldName) {
        mapping.schemaColumn = null;
        this.mappingForm.get(mapping.csvColumn)?.setValue(null, { emitEvent: false });
      }
    });
  }

  toggleSchemaEdit(): void {
    this.editingSchema = !this.editingSchema;
  }

  resetSchemaToDefault(): void {
    this.predefinedSchema = [...PREDEFINED_SCHEMAS[this.selectedStudy]];
    this.buildSchemaMap();
    
    // Si un fichier est chargé, refaire le mapping
    if (this.isFileUploaded) {
      this.remapColumns();
    }
  }

  trackByColumn(index: number, mapping: ColumnMapping): string {
    return mapping.csvColumn;
  }
}
