import { FormControl } from '@angular/forms';
import { validateDateNotInFuture } from './date-validator.directive';

describe('validateDateNotInFuture', () => {
  const validator = validateDateNotInFuture();

  it('should return null for a date clearly in the past', () => {
    const control = new FormControl('2000-01-01');
    expect(validator(control)).toBeNull();
  });

  it('should return null for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const value = yesterday.toISOString().split('T')[0];
    const control = new FormControl(value);
    expect(validator(control)).toBeNull();
  });

  it('should return an error object for a date clearly in the future', () => {
    const control = new FormControl('2099-12-31');
    expect(validator(control)).toEqual({ dateInFuture: 'todo message' });
  });

  it('should return an error object for tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const value = tomorrow.toISOString().split('T')[0];
    const control = new FormControl(value);
    expect(validator(control)).toEqual({ dateInFuture: 'todo message' });
  });
});
