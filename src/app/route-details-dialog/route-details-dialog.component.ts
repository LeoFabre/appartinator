import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RouteDetails } from '../interfaces/routeDetails';
import { Scroller } from 'primeng/scroller';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { travelModes } from '../interfaces/travelModes';

@Component({
  selector: 'app-route-details-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, DividerModule, Scroller],
  templateUrl: './route-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteDetailsDialogComponent {
  @Input() route!: RouteDetails;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  sanitizeInstruction(instruction: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(instruction);
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.cdr.detectChanges();
  }

  protected readonly travelModes = travelModes;

  getTravelModeLabel(mode: 'DRIVING' | 'TRANSIT'): string {
    return travelModes.find((travelMode) => travelMode.value === mode)?.label || '';
  }
}
