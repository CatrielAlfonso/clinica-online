import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortEmail',
  standalone: false,
})
export class ShortEmailPipe implements PipeTransform {

 transform(email: string, maxLength: number = 15): string {
    if (!email) return '';

    if (email.length <= maxLength) return email;

    const [user, domain] = email.split('@');

    // Si el correo es demasiado largo
    return `${user}@${domain.substring(0, 2)}...`;
  }

}
