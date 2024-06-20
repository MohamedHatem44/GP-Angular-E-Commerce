import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageDetailsModalComponent } from './admin-message-details-modal.component';

describe('AdminMessageDetailsModalComponent', () => {
  let component: AdminMessageDetailsModalComponent;
  let fixture: ComponentFixture<AdminMessageDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMessageDetailsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMessageDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
