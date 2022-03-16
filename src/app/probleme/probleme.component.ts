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
        noTypeProbleme: ['',[Validators.required]]
    });

    this.categories.obtenirCategories()
    .subscribe(cat => this.typesProblemes = cat,
               error => this.errorMessage = <any>error);  
  }

  save(): void {
  }

}
