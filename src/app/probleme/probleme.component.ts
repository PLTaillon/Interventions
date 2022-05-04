import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { emailMatcherValidator } from '../shared/email-matcher/email-matcher.component';
import { VerifierCaracteresValidator } from '../shared/longueur-minimum/longueur-minimum.component';
import { ProblemeService } from './probleme.service';
import { IProbleme } from './problemedesc';
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

  probleme: IProbleme;



  constructor(private fb: FormBuilder, private categories: TypeproblemeService, private problemeService : ProblemeService, private route : Router) { }

  ngOnInit() {
    this.problemeForm = this.fb.group({
        prenom: ['',[VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
        nom: ['',[VerifierCaracteresValidator.longueurMinimum(3), Validators.required]],
        noTypeProbleme: [''/*,[Validators.required]*/],
        courrielGroup: this.fb.group({
          courriel: [{value: '', disabled: true}],
          courrielConfirmation: [{value: '', disabled: true}],
        }),
      telephone: [{value: '', disabled: true}],
      notification:['pasnotifier'],
      descriptionProbleme:['', [Validators.required, Validators.minLength(5)]],
      noUnite:'',
      dateProbleme:{value:Date(), disabled:true}
    });

    this.categories.obtenirCategories()
    .subscribe(cat => this.typesProblemes = cat,
               error => this.errorMessage = <any>error);  
    this.problemeForm.get('notification').valueChanges
    .subscribe(value=>this.appliquerNotifications(value))
  }

  save(): void {
    if (this.problemeForm.dirty && this.problemeForm.valid) {
        // Copy the form values over the problem object values
        this.probleme = this.problemeForm.value;
        this.probleme.id = 0;
        this.probleme.courriel = this.problemeForm.get('courrielGroup.courriel').value;
        //this.probleme.dateProbleme = new Date();
        this.problemeService.saveProbleme(this.probleme)
            .subscribe( // on s'abonne car on a un retour du serveur à un moment donné avec la callback fonction
                () => this.onSaveComplete(),  // Fonction callback
                (error: any) => this.errorMessage = <any>error
            );
    } else if (!this.problemeForm.dirty) {
        this.onSaveComplete();
    }
  }

  onSaveComplete(): void { 
    // Reset the form to clear the flags
    this.problemeForm.reset();  // Pour remettre Dirty à false.  Autrement le Route Guard va dire que le formulaire n'est pas sauvegardé
    this.route.navigate(['/accueil']);
  }

  appliquerNotifications(notifications: string) : void {
    const courrielsGroupControl = this.problemeForm.get('courrielGroup');
    const courrielControl = this.problemeForm.get("courrielGroup.courriel");
    const courrielConfirmationControl = this.problemeForm.get("courrielGroup.courrielConfirmation");
    const telephoneControl = this.problemeForm.get("telephone");

    courrielControl.clearValidators();
    courrielControl.reset();
    courrielControl.disable();

    courrielConfirmationControl.clearValidators();
    courrielConfirmationControl.reset();
    courrielConfirmationControl.disable();

    telephoneControl.clearValidators();
    telephoneControl.reset();
    telephoneControl.disable();

    if(notifications === 'courriel'){

      courrielsGroupControl.setValidators([Validators.compose([emailMatcherValidator.courrielDifferents()])])
      courrielControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      courrielConfirmationControl.setValidators([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]);
      courrielControl.enable();
      courrielConfirmationControl.enable();
    }
    if(notifications === 'messageTelephone'){
      
      telephoneControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]);
      telephoneControl.enable();
    }
    
    courrielControl.updateValueAndValidity();
    courrielConfirmationControl.updateValueAndValidity();
    telephoneControl.updateValueAndValidity();
  }

}
