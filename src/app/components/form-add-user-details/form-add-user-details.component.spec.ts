import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FormAddUserDetailsComponent } from './form-add-user-details.component';
import { By } from '@angular/platform-browser';

describe('FormAddUserDetailsComponent', () => {
  let component: FormAddUserDetailsComponent;
  let fixture: ComponentFixture<FormAddUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        FormAddUserDetailsComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize inputs correctly', () => {
    component.modalTitle = 'Aggiungi Utente';
    component.modalDescription = 'Inserisci i dettagli utente';
    component.showTokenField = true;
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain('Aggiungi Utente');
  });

  it('should emit userDetails on submit', () => {
    
    spyOn(component.userDetails, 'emit');
    component.tempUserName = 'Mario Rossi';
    component.tempUserEmail = 'mario.rossi@example.com';
    component.tempUserGender = 'male';
    component.tempUserToken = '123456';
    component.onSubmit();
    expect(component.userDetails.emit).toHaveBeenCalledWith({
      name: 'Mario Rossi',
      email: 'mario.rossi@example.com',
      gender: 'male',
      token: '123456'
    });
  });

  it('should emit cancel event on closeModal', () => {
    spyOn(component.cancel, 'emit');
    component.closeModal();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});