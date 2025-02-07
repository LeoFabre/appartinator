import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface RouteDetails {
  destination: string;
  mode: 'DRIVING' | 'TRANSIT';
  duration?: string;
  arrivalTime?: Date;
}

@Component({
  selector: 'app-route-details-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './route-details-dialog.component.html',
})
export class RouteDetailsDialogComponent {
  @Input() route!: RouteDetails;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
