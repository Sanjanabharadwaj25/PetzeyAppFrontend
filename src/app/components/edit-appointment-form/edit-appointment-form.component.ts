import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Status } from '../../models/Status';
import { AppointmentDetail } from '../../models/AppointmentDetail';
import { GeneralPetIssue } from '../../models/GeneralPetIssue';
import { Veterinarian } from '../../models/Veterinarian';
import { PetParent } from '../../models/PetParent';
import { Pet } from '../../models/Pet';
import { PetIssue } from '../../models/PetIssue';
import { AppointmentFormService } from '../../services/Appointment_Form_Services/appointment-form.service';
import { RouterLink } from '@angular/router';


declare var window:any;
@Component({
  selector: 'app-edit-appointment-form',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './edit-appointment-form.component.html',
  styleUrl: './edit-appointment-form.component.css'
})
export class EditAppointmentFormComponent implements OnInit {

  formModal: any;
  cancelAptModal: any;

  // id of appointment to edit;
  AppointmentID: number = 44;
  appointmentDetail: AppointmentDetail = {
    AppointmentID: 0,
    DoctorID: 0,
    PetID: 0,
    OwnerID: 0,
    ScheduleDate: new Date(),
    ScheduleTimeSlot: 0,
    BookingDate: new Date(),
    ReasonForVisit: '',
    Status: Status.Pending,
    Report: null,
    PetIssues: []
  };
  slotStatuses: boolean[] = [];
  selectedScheduleDate: Date = new Date();
  selectedSlotIndex: number | null = null;

  constructor(private aptService: AppointmentFormService) { }

  generalPetIssues: GeneralPetIssue[] = [];
  petIssueSearchText = '';
  //petIssuesNames: string[] = [];// to be fetched from backend and assingned in the ngonit
  filteredpetIssues: GeneralPetIssue[] = [];

  // variable data for vets
  veternarians: Veterinarian[] = []; // to be fetched from backend or dummy json server and assigned in oninit method
  veternarianSearchText = '';
  filteredVets: Veterinarian[] = [];
  vetDateAndSlotPicker: boolean = false;

  //// for pet parents
  petParents: PetParent[] = [];
  petParentSearchText = '';
  filteredPetParents: PetParent[] = [];

  // for pets
  pets: Pet[] = [];
  petSearchText = '';
  filteredPets: Pet[] = [];



  ngOnInit(): void {
    
    this.aptService.getAppointmentById(this.AppointmentID).subscribe({
      next: (data) => {
        this.appointmentDetail = data;
        this.AppointmentID = this.appointmentDetail.AppointmentID;
        this.selectedScheduleDate = this.appointmentDetail.ScheduleDate;
        this.selectedSlotIndex=this.appointmentDetail.ScheduleTimeSlot;
        this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID,new Date(this.appointmentDetail.ScheduleDate)).subscribe({
          next:(data)=>{
            console.log(data+"data here");
            this.slotStatuses = data;
            // this.slotStatuses[this.appointmentDetail.ScheduleTimeSlot]=true;
          },
          error:(err)=>{
            console.log("error in oninit slot status fetching",err);
            
          }
        });
        console.log("feteched appointmetnDetail for editing", data);
      },
      error: (err) => {
        console.log("error occured while fetching appointment detail by id in edit appointment component", err);
      }
    });

    this.formModal= new window.bootstrap.Modal(document.getElementById("exampleModal"));
    this.cancelAptModal = new window.bootstrap.Modal(document.getElementById('exampleModal2'));
    //

    this.aptService.getVeternarians().subscribe({
      next: (data: Veterinarian[]) => {
        for (let i = 0; i < data.length; i++) {
          //console.log(typeof data[i].id + " and "+typeof this.appointmentDetail.DoctorID);
          // LATER I HAVE TO MAKE IT AS ===
          if (data[i].id == this.appointmentDetail.DoctorID) {
            this.veternarianSearchText = data[i].name;
          }
        }
      },
      error: (err) => { console.log("error in getting vets data", err); }
    });

    this.aptService.getPetParents().subscribe({
      next: (data) => {
        const foundItem = data.find((pp) => pp.id == this.appointmentDetail.OwnerID);
        if (foundItem) {
          this.petParentSearchText = foundItem.name;
        } else {
          this.petParentSearchText = 'Default owner Name'; // Or handle the undefined case differently
        }
      }
    });

    this.aptService.getPets().subscribe({
      next:(data)=>{
        const foundItem = data.find((p) => p.id == this.appointmentDetail.PetID);
        if (foundItem) {
          this.petSearchText = foundItem.name;
        } else {
          this.petSearchText = 'Default pet Name'; // Or handle the undefined case differently
        }
      },
      error:(err)=>{
        console.log("errorrrrr",err);
      }
    });

    this.aptService.getGeneralPetIssues().subscribe({
      next: (data) => {
        if (this.appointmentDetail.PetIssues && this.appointmentDetail.PetIssues.length > 0) {
          const firstIssueName = this.appointmentDetail.PetIssues[0].IssueName;
          this.petIssueSearchText = data.find(pi => { 
          console.log("general issue name="+pi.IssueName+" type is "+typeof pi.IssueName);
          return pi.IssueName == firstIssueName;
           })?.IssueName || 'No Issue Found';
        } else {
          // Handle the case where there are no pet issues
          this.petIssueSearchText = 'Default Issue Name';
        }
      },
      error: (err) => {
        console.log("error", err);
      }
    });

    this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
      next: (data) => {
        this.slotStatuses = data, console.log("default date schedules success", data);
      },
      error: (err) => {
        console.log("error occured array fetch", err);
      }
    });

    // modal popup code 
    // this.formModal= new window.bootstrap.Modal(
    //   document.getElementById("exampleModal")
    // );
    // this.cancelAptModal = new window.bootstrap.Modal(document.getElementById('exampleModal2'));
    //
    //this.selectedScheduleDate = new Date();
    // this is the method to getGeneralPetIssues from backend server
    this.aptService.getGeneralPetIssues().subscribe({
      next: (data) => {
        this.generalPetIssues = data;
        //console.log("logging data of generalpetissues",data);
        //console.log("my gpetissues",this.generalPetIssues);
        this.filteredpetIssues = this.generalPetIssues;
      },
      error: (err) => { console.error('there was an error in while fetching the generalpetissue in the appointment form ng onint', err) }
    });

    // this is the method to get Veternarians from the backend of other teams api
    this.aptService.getVeternarians().subscribe({
      next: (data) => {
        this.veternarians = data;
        this.filteredVets = this.veternarians;
        console.log(this.veternarians);
      },
      error: (err) => { console.error('there was error in vets fetch', err); }
    });

    // this is the method for pet parents 
    this.aptService.getPetParents().subscribe({
      next: (data) => {
        this.petParents = data;
        this.filteredPetParents = this.petParents;
        console.log(this.petParents);
      },
      error: (err) => { console.log('error in fetching petParents', err); }
    });

    // this is the method for  fetching pets 
    this.aptService.getPets().subscribe({
      next: (data) => {
        this.pets = data;
        this.filteredPets = this.pets;
        console.log('pets are ', this.pets);
      },
      error: (err) => { console.log('eror in fetching pets', err); }
    });

  }
  // modal popup code for submission
  openModal() {
    alert("here");
    this.formModal.show();
  }
  closeModal() {
    this.formModal.hide();
  }
  // cancel model
  openCancelModal() {
    this.cancelAptModal.show();
  }
  closeCancelModal() {
    this.cancelAptModal.hide();
  }

  filterPetIssues(): void {
    if (!this.petIssueSearchText.length) {
      this.filteredpetIssues = [];
    }
    else {
      this.filteredpetIssues = this.generalPetIssues.filter(c => c.IssueName.toLowerCase().includes(this.petIssueSearchText.toLowerCase()));
    }
  }

  selectPetIssue(petIssue: string): void {
    this.petIssueSearchText = '';
    // remove element from the general pet issues.
    this.generalPetIssues = this.generalPetIssues.filter(gpi=>gpi.IssueName!==petIssue);
    this.filteredpetIssues = [];
    let tempPetIssue:PetIssue ={
      PetIssueID: 0,
      IssueName: petIssue,
    }
    this.appointmentDetail.PetIssues.push(tempPetIssue);
  }
  onDisSelectPetIssue(Pi:PetIssue) {
    this.appointmentDetail.PetIssues = this.appointmentDetail.PetIssues.filter(pi=>pi.IssueName!==Pi.IssueName);
  }

  // veternarian methods 
  filterVeternarians(): void {
    if (!this.veternarianSearchText.length) {
      this.filteredVets = [];
      if (this.veternarianSearchText) {
        this.vetDateAndSlotPicker = true;
      } else {
        this.vetDateAndSlotPicker = false;
      }
    }
    else {
      this.filteredVets = this.veternarians.filter(v => v.name.toLowerCase().includes(this.veternarianSearchText.toLowerCase()));
      if (this.veternarianSearchText) {
        this.vetDateAndSlotPicker = true;
      } else {
        this.vetDateAndSlotPicker = false;
      }
    }
  }
  selectVeternarian(vid: number, vname: string): void {
    // we need to assign for the respective variable in the appointment object
    this.veternarianSearchText = vname;
    this.filteredVets = [];
    if (this.veternarianSearchText) {
      this.vetDateAndSlotPicker = true;
    } else {
      this.vetDateAndSlotPicker = false;
    }
    // by default it should fetch the schedules for today.
    this.appointmentDetail.DoctorID = vid;
    // this.selectedScheduleDate = new Date();
    this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
      next: (data) => {
        this.slotStatuses = data, console.log("default date schedules success", data);
      },
      error: (err) => {
        console.log("error occured array fetch", err);
      }
    });
  }

  onDateChange() {
    //alert("scheduled date"+this.selectedScheduleDate);
    this.appointmentDetail.ScheduleDate = this.selectedScheduleDate;
    this.aptService.getScheduleSlotStatuses(this.appointmentDetail.DoctorID, new Date(this.selectedScheduleDate)).subscribe({
      next: (data) => {
        this.slotStatuses = data, console.log("fetched the slots boolean array success", data);
      },
      error: (err) => {
        console.log("error occured while fetching the slots bool array", err);
      }
    });
  }

  isDisabled(index: number): boolean {
    return this.slotStatuses[index];
  }

  onSlotClick(slot: string, index: number,): void {
    if (!this.isDisabled(index)) {
      console.log('Slot selected:', slot);
      console.log('selected slot index', index);
      this.selectedSlotIndex = index;
      this.appointmentDetail.ScheduleTimeSlot = index;
    }
  }

  isSelected(index: number): boolean {
    this.appointmentDetail.ScheduleTimeSlot = index;
    return index === this.selectedSlotIndex;
  }

  filterPetParents(): void {
    if (!this.petParentSearchText.length) {
      this.filteredPetParents = [];
    }
    else {
      this.filteredPetParents = this.petParents.filter(pp => pp.name.toLowerCase().includes(this.petParentSearchText.toLowerCase()));
    }
  }

  selectPetParent(ppid: number, ppname: string): void {
    this.petParentSearchText = ppname;
    this.filteredPetParents = [];
    this.appointmentDetail.OwnerID = ppid;
  }

  // methods for pets 
  filterPets(): void {
    if (!this.petSearchText.length) {
      this.filteredPets = [];
    }
    else {
      this.filteredPets = this.pets.filter(p => p.name.toLowerCase().includes(this.petSearchText.toLowerCase()));
    }
  }
  selectPet(petid: number, petname: string) {
    this.petSearchText = petname;
    this.filteredPets = [];
    this.appointmentDetail.PetID = petid;
  }

  timeSlotRows: string[][] = [
    ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
    ['12:00', '12:30', '14:00', '14:30', '15:00', '15:30'],
    ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']
  ];

  onBookEditBooking(reasonforvisit: string) {
    this.appointmentDetail.BookingDate = new Date();
    this.appointmentDetail.ReasonForVisit = reasonforvisit;
    this.appointmentDetail.Status = Status.Pending;
    this.appointmentDetail.Report = null;
    this.appointmentDetail.ScheduleTimeSlot=this.selectedSlotIndex!;
    // alert("inside booking");
    // finally call the service post method.
    this.aptService.putAppointmentByIdandObj(this.appointmentDetail.AppointmentID,this.appointmentDetail).subscribe({
      next:(data)=>{
        let editedAppointment = data;
        console.log("I am loggin edited appointment for our reference"+editedAppointment);
        
      },
      error:(err)=>{
        console.log("errooor occured while sending put request",err);
      }
    });
    alert("edit success");
    this.closeModal();
  }

  isSubmitDisabled: boolean = true;

  toggleDisabled(): void {
    this.isSubmitDisabled = !this.isSubmitDisabled;
  }


}
