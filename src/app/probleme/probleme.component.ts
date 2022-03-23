import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerifierCaracteresValidator } from '../shared/longueur-minimum/longueur-minimum.component';
import { ITypeProbleme } from './typeprobleme';
import { TypeproblemeService } from './typeprobleme.service';

@Component({
  selector: 'app-probleme',
  templateUrl: './probleme.component.html',
  styleUrls: ['./probleme.component.css']
})
export class ProblemeComponent implements OnInit {
  problemeForm: FormGroup;
  typesProblemes: ITypeProbleme[];
  errorMessage: string;

  constructor(private fb: FormBuilder, private categories: TypeproblemeService) { }

  ngOnInit() {
    this.problemeForm = this.fb.group({
        prenom: ['',[VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
        nom: ['',[VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
        noTypeProbleme: ['',[Validators.required]],
        courrielGroup: this.fb.group({
          courriel: [{value: '', disabled: true}],
          courrielConfirmation: [{value: '', disabled: true}],
        }),
      telephone: [{value: '', disabled: true}]
    });

    this.categories.obtenirCategories()
    .subscribe(cat => this.typesProblemes = cat,
               error => this.errorMessage = <any>error);  
  }

  save(): void {
  }

  appliquerNotifications(notifications: string) : void {
    const courrielsGroupControl = this.problemeForm.get('courrielGroup');
    const courrielControl = this.problemeForm.get("courrielGroup.courriel");
    const courrielConfirmationControl = this.problemeForm.get("courrielGroup.courrielConfirmation");
    const telephoneControl = this.problemeForm.get("telephone");

    telephoneControl.clearValidators();
    telephoneControl.reset();
    telephoneControl.disable();

    if(notifications === 'Activee'){
        courrielsGroupControl.setValidators([Validators.required]);
        courrielsGroupControl.enable();
        telephoneControl.setValidators([Validators.required]);
        telephoneControl.enable();
    }
    
    courrielsGroupControl.updateValueAndValidity();
    telephoneControl.updateValueAndValidity();
  }

}
