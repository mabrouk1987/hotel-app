import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.reservationService.getReservation(id).subscribe( reservation => {
        if (reservation) {
          this.reservationForm.patchValue(reservation);
        }
      });


    }
  }

  reservationForm: FormGroup = new FormGroup({});

  protected onSubmit(): void {
    if (this.reservationForm.invalid) {
      return;
    }

    let reservation: Reservation = this.reservationForm.value;

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.reservationService.updateReservation(id, reservation).subscribe(() => {
        console.log('Update request processed');
      });
    } else {
      this.reservationService.addReservation(reservation).subscribe(() => {
        console.log('Add request processed');
      });
    }

    this.router.navigate(['/list']);
  }

}
