import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  parseCSV(file: File, delimiter: string = ','): Promise<{ headers: string[], data: any[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter((line: string) => line.trim() !== '');
          
          if (lines.length === 0) {
            reject(new Error('Le fichier CSV est vide'));
            return;
          }

          // Parser la première ligne pour obtenir les en-têtes
          const headers = this.parseCSVLine(lines[0], delimiter);
          
          // Parser les données
          const data = [];
          for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i], delimiter);
            if (values.length === headers.length) {
              const row: any = {};
              headers.forEach((header, index) => {
                row[header] = values[index];
              });
              data.push(row);
            }
          }

          resolve({ headers, data });
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsText(file);
    });
  }

  private parseCSVLine(line: string, delimiter: string = ','): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
}
