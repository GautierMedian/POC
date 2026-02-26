export type ValueMappingColumn = 'Modality' | 'VisitName';

export interface ValueMappingItem {
  originalValue: string;
  correctedValue: string;
}

export type ValueMappingDict = Record<string, Record<ValueMappingColumn, ValueMappingItem[]>>;

export const VALUE_MAPPINGS: ValueMappingDict = {
  'KELN-PH-002': {
    'Modality': [
      { originalValue: 'PET/CT扫描', correctedValue: 'PT' },
      { originalValue: '其他(DX)', correctedValue: 'X-Ray' },
      { originalValue: '增强CT', correctedValue: 'CT with contrast' },
      { originalValue: '增强MRI', correctedValue: 'MR with contrast' },
      { originalValue: '平扫+增强CT', correctedValue: 'CT with contrast' },
      { originalValue: '平扫+增强MRI', correctedValue: 'MR with contrast' },
      { originalValue: '平扫CT', correctedValue: 'CT without contrast' },
      { originalValue: '平扫MRI', correctedValue: 'MR without contrast' },
      { originalValue: '骨扫描成像', correctedValue: 'NM' }
    ],
    'VisitName': [
      { originalValue: '疗效评估(RECIST1.1)-计划外(unscheduled 1)', correctedValue: 'Unscheduled 1' },
      { originalValue: '疗效评估(RECIST1.1)-计划外(unscheduled 2)', correctedValue: 'Unscheduled 2' },
      { originalValue: '疗效评估(RECIST1.1)-计划外(unscheduled 3)', correctedValue: 'Unscheduled 3' },
      { originalValue: '疗效评估-108W', correctedValue: 'Week 108' },
      { originalValue: '疗效评估-12W', correctedValue: 'Week 12' },
      { originalValue: '疗效评估-18W', correctedValue: 'Week 18' },
      { originalValue: '疗效评估-24W', correctedValue: 'Week 24' },
      { originalValue: '疗效评估-30W', correctedValue: 'Week 30' },
      { originalValue: '疗效评估-36W', correctedValue: 'Week 36' },
      { originalValue: '疗效评估-42W', correctedValue: 'Week 42' },
      { originalValue: '疗效评估-48W', correctedValue: 'Week 48' },
      { originalValue: '疗效评估-54W', correctedValue: 'Week 54' },
      { originalValue: '疗效评估-63W', correctedValue: 'Week 63' },
      { originalValue: '疗效评估-6W', correctedValue: 'Week 6' },
      { originalValue: '疗效评估-72W', correctedValue: 'Week 72' },
      { originalValue: '疗效评估-81W', correctedValue: 'Week 81' },
      { originalValue: '疗效评估-90W', correctedValue: 'Week 90' },
      { originalValue: '疗效评估-99W', correctedValue: 'Week 99' },
      { originalValue: '疗效评估-117W', correctedValue: 'Week 117' },
      { originalValue: '疗效评估-126W', correctedValue: 'Week 126' },
      { originalValue: '疗效评估-135W', correctedValue: 'Week 135' },
      { originalValue: '疗效评估-144W', correctedValue: 'Week 144' },
      { originalValue: '疗效评估-153W', correctedValue: 'Week 153' },
      { originalValue: '疗效评估-162W', correctedValue: 'Week 162' },
      { originalValue: '疗效评估-171W', correctedValue: 'Week 171' },
      { originalValue: '疗效评估-出组', correctedValue: 'EOT' },
      { originalValue: '筛选期', correctedValue: 'Screening' }
    ]
  }
};
