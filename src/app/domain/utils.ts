export class Utils {

  static stringToDate(s: string): Date {
    if (!s) {
      return null;
    }
    let date: string[] = s.split('.');
    let day = date[0].padStart(2, '0');
    let month = date[1].padStart(2, '0');
    let year = date[2];
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

}