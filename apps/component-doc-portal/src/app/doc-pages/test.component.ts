import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-test',
  imports: [JsonPipe],
  template: `
    <p>The Text: {{ text | json }}</p>
    <p>pet: {{ pet | json }}</p>
    <p>
      color:
      <span class="color-block" [style.background]="color"></span>
    </p>
    <p>food: {{ food | json }}</p>
  `,
  styles: [
    `
      :host {
        padding: 5px 20px;
        display: block;
        background-color: rgb(32, 122, 195);
        font-size: 24px;
        color: white;

        .color-block {
          display: inline-block;
          padding: 5px;
          height: 15px;
          width: 15px;
        }
      }
    `,
  ],
})
export class TestComponent {
  @Input() text?: string;
  @Input() pet?: string;
  @Input() color?: string;
  @Input() food?: string;
}
