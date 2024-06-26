import { AuthService } from './../../../services/UserAuthServices/auth.service';
import { IPet } from './../../../models/Pets/IPet';
import { Component, Input, OnInit } from '@angular/core';
import { AgePipe } from "../../../pipes/Age/age.pipe";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from '../../../pipes/Ellipsis/ellipsis.pipe';
import { User } from '../../../models/User-Authentication/User';
import {  FormatName } from "../../../pipes/Name/format-name.pipe";
import { IPetGridDto } from '../../../models/Pets/IPetGridDto';
import { PetsService } from '../../../services/PetsServices/pets.service';
import { Allergy } from '../../../models/Pets/IAllergy';

@Component({
    selector: 'app-pet-card',
    standalone: true,
    templateUrl: './pet-card.component.html',
    styleUrl: './pet-card.component.css',
    imports: [AgePipe, RouterLink, CommonModule, EllipsisPipe, FormatName]
})

// Child Component of Pet-list-grid
// To display each Pet

export class PetCardComponent {


  @Input()
  pet:IPet | IPetGridDto = {} as IPet;  // Get the Pet Object to be displayed from Parent Component

  @Input()
  petOwner:string = "";   // Get the Owner Name for the pet

}


