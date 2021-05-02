import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

  // Regular expression pattern for only numbers
  private regex: RegExp = new RegExp('^[0-9]*$');

  // specialkeys array
  private specialKeys: string[] = ['Shift', 'Alt', 'Control', 'Tab', 'Escape', 'Insert', 'Delete', 'Home', 'End',
                                   'Enter', 'CapsLock', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  constructor(private elementRef: ElementRef) { }

  // On Key pressed
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {

    // Perform default action if special key is pressed
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Store input
    const inputValue: string = this.elementRef.nativeElement.value.concat(event.key);

    // Check if input valid and block on invalid input
    if (inputValue && !String(inputValue).match(this.regex)) {
      event.preventDefault();
    }

    // perform default action on valid input
    return;
  }

  // On Copy-Paste action
  @HostListener('paste', ['$event']) onPaste(event): void {

    // store copied clipboard data
    const clipboardData = (event.originalEvent || event).clipboardData.getData('text/plain');

    // check if clipboard data is not null
    if (clipboardData) {

      // check if the clipboard data is valid and block action on invalid
      if (!this.regex.test(clipboardData)) {
        event.preventDefault();
      }
    }

    // perform default action on valid clipbiard data
    return;
  }

}
