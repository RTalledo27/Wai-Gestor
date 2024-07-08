import { Component, Input, Inject } from '@angular/core';

import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

 @Input() message: string = '';
 constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
