import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public domainURL: string = "https://synergy.sandtell.com/";
  constructor() { }
}
