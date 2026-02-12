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
import { ColumnMapping, SchemaField, PREDEFINED_SCHEMA, PREDEFINED_SCHEMAS, ValidationError, ValidationResult } from '../../models/column-mapping.model';

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
  availableSheets: string[] = [];
  selectedSheet: string = '';
  isExcelFile: boolean = false;
  excelWorkbook: any = null;
  
  // Gestion des études
  availableStudies: string[] = Object.keys(PREDEFINED_SCHEMAS);
  selectedStudy: string = this.availableStudies[0];
  
  // Validation
  validationResult: ValidationResult | null = null;
  showValidationErrors: boolean = false;
  isValidating: boolean = false;

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

    const lowerName = file.name.toLowerCase();
    const isCsv = lowerName.endsWith('.csv');
    const isExcel = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls');

    if (!isCsv && !isExcel) {
      this.errorMessage = 'Veuillez sélectionner un fichier CSV ou Excel';
      return;
    }

    this.resetCurrentFileState(false);
    this.fileName = file.name;
    this.errorMessage = '';
    this.isLoading = true;
    this.isExcelFile = isExcel;

    if (isCsv) {
      this.csvParser.parseCSV(file, this.csvDelimiter)
        .then(result => {
          this.applyParsedData(result);
        })
        .catch(error => {
          this.errorMessage = error.message || 'Erreur lors du parsing du fichier CSV';
          console.error('Error parsing CSV:', error);
        })
        .finally(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      return;
    }

    this.csvParser.parseExcel(file)
      .then(result => {
        this.excelWorkbook = result.workbook;
        this.availableSheets = result.sheetNames;
        this.selectedSheet = this.availableSheets[0];
        this.loadExcelSheet(this.selectedSheet);
      })
      .catch(error => {
        this.errorMessage = error.message || 'Erreur lors du parsing du fichier Excel';
        console.error('Error parsing Excel:', error);
      })
      .finally(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  onSheetChange(sheetName: string): void {
    this.selectedSheet = sheetName;
    this.loadExcelSheet(sheetName);
  }

  private loadExcelSheet(sheetName: string): void {
    if (!this.excelWorkbook) {
      return;
    }

    try {
      const result = this.csvParser.parseExcelSheet(this.excelWorkbook, sheetName);
      this.applyParsedData(result);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur lors du chargement de l\'onglet';
      console.error('Error loading Excel sheet:', error);
    }
  }

  private applyParsedData(result: { headers: string[]; data: any[] }): void {
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
    this.clearValidation();

    // Forcer la détection de changements
    this.cdr.detectChanges();
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

  validateData(): void {
    if (!this.validateMapping()) {
      this.errorMessage = 'Tous les champs obligatoires doivent être mappés avant la validation';
      return;
    }

    this.isValidating = true;
    this.errorMessage = '';
    this.validationResult = null;

    // Exécuter la validation de manière asynchrone pour ne pas bloquer l'UI
    setTimeout(() => {
      const errors: ValidationError[] = [];
      const mappedFields = this.columnMappings.filter(m => m.schemaColumn !== null);

      // Créer un map pour accès rapide
      const columnToSchemaMap = new Map<string, string>();
      mappedFields.forEach(m => {
        if (m.schemaColumn) {
          columnToSchemaMap.set(m.csvColumn, m.schemaColumn);
        }
      });

      // Valider chaque ligne
      this.csvData.forEach((row, rowIndex) => {
        // Vérifier les champs obligatoires
        this.predefinedSchema
          .filter(field => field.required)
          .forEach(field => {
            // Trouver la colonne CSV correspondante
            const csvColumn = Array.from(columnToSchemaMap.entries())
              .find(([_, schema]) => schema === field.name)?.[0];

            if (!csvColumn) {
              errors.push({
                rowIndex: rowIndex + 1,
                field: field.name,
                value: null,
                message: `Champ obligatoire "${field.name}" non mappé`,
                severity: 'error'
              });
              return;
            }

            const value = row[csvColumn];
            if (value === null || value === undefined || value === '') {
              errors.push({
                rowIndex: rowIndex + 1,
                field: field.name,
                value: value,
                message: `Champ obligatoire "${field.name}" vide`,
                severity: 'error'
              });
            }
          });

        // Valider les types de données
        mappedFields.forEach(mapping => {
          const schemaField = this.schemaMap.get(mapping.schemaColumn!);
          if (!schemaField) return;

          const value = row[mapping.csvColumn];
          if (value === null || value === undefined || value === '') {
            // Champs vides déjà gérés pour les obligatoires
            return;
          }

          // Validation des dates
          if (schemaField.type === 'date') {
            const dateValue = new Date(value);
            if (isNaN(dateValue.getTime())) {
              errors.push({
                rowIndex: rowIndex + 1,
                field: schemaField.name,
                value: value,
                message: `Format de date invalide pour "${schemaField.name}": "${value}"`,
                severity: 'error'
              });
            }
          }

          // Validation des nombres (si type number est ajouté plus tard)
          if (schemaField.type === 'number') {
            if (isNaN(Number(value))) {
              errors.push({
                rowIndex: rowIndex + 1,
                field: schemaField.name,
                value: value,
                message: `Valeur numérique invalide pour "${schemaField.name}": "${value}"`,
                severity: 'error'
              });
            }
          }
        });
      });

      // Créer le résultat de validation
      const invalidRowsSet = new Set(errors.map(e => e.rowIndex));
      this.validationResult = {
        isValid: errors.length === 0,
        errors: errors,
        totalRows: this.csvData.length,
        validRows: this.csvData.length - invalidRowsSet.size,
        invalidRows: invalidRowsSet.size
      };

      this.showValidationErrors = true;
      this.isValidating = false;
      this.cdr.detectChanges();
    }, 100);
  }

  getErrorsForRow(rowIndex: number): ValidationError[] {
    if (!this.validationResult) return [];
    return this.validationResult.errors.filter(e => e.rowIndex === rowIndex);
  }

  getUniqueInvalidRows(): number[] {
    if (!this.validationResult) return [];
    const rows = new Set(this.validationResult.errors.map(e => e.rowIndex));
    return Array.from(rows).sort((a, b) => a - b);
  }

  clearValidation(): void {
    this.validationResult = null;
    this.showValidationErrors = false;
  }

  submitMapping(): void {
    if (!this.validateMapping()) {
      this.errorMessage = 'Tous les champs obligatoires doivent être mappés';
      return;
    }

    // Avertir si la validation n'a pas été effectuée
    if (!this.validationResult) {
      const proceed = confirm('Vous n\'avez pas validé les données. Voulez-vous continuer le téléchargement sans validation ?');
      if (!proceed) {
        this.errorMessage = 'Veuillez valider les données avant de télécharger';
        return;
      }
    } else if (!this.validationResult.isValid) {
      const proceed = confirm(
        `${this.validationResult.invalidRows} ligne(s) contiennent des erreurs. ` +
        `Voulez-vous télécharger uniquement les ${this.validationResult.validRows} ligne(s) valide(s) ?`
      );
      if (!proceed) {
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simuler un délai pour la génération du fichier (optionnel)
    setTimeout(() => {
      // Déterminer quelles lignes inclure
      let dataToProcess = this.csvData;
      
      if (this.validationResult && !this.validationResult.isValid) {
        // Obtenir les indices des lignes invalides (en base 1)
        const invalidRowIndices = new Set(this.validationResult.errors.map(e => e.rowIndex));
        // Filtrer pour ne garder que les lignes valides (les indices csvData sont en base 0)
        dataToProcess = this.csvData.filter((_, index) => !invalidRowIndices.has(index + 1));
      }
      
      // Créer le résultat du mapping
      const mappedData = dataToProcess.map(row => {
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
        mappedData: mappedData,
        totalRows: this.csvData.length,
        processedRows: dataToProcess.length
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
    this.resetCurrentFileState(true);
    // Ne pas réinitialiser le délimiteur pour garder le choix de l'utilisateur
  }

  private resetCurrentFileState(clearFileInput: boolean): void {
    this.csvHeaders = [];
    this.csvData = [];
    this.columnMappings = [];
    this.fileName = '';
    this.isFileUploaded = false;
    this.errorMessage = '';
    this.mappingForm = this.fb.group({});
    this.clearValidation();
    this.availableSheets = [];
    this.selectedSheet = '';
    this.isExcelFile = false;
    this.excelWorkbook = null;

    if (clearFileInput) {
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
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
