import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvMapperComponent } from './csv-mapper.component';

describe('CsvMapperComponent', () => {
  let component: CsvMapperComponent;
  let fixture: ComponentFixture<CsvMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvMapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
