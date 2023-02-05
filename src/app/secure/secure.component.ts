import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {EaseeApiService} from "../easee-api.service";
import {forkJoin, map} from 'rxjs';
import {Charger, Permission, PowerUsage} from "../Chargers";
import {User} from "../User";
import {ErrorStateMatcher} from "@angular/material/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {AngularCsv} from 'angular-csv-ext/dist/Angular-csv';
import {allChargers} from '../ChargersWithUsers'; //not in git due to security reasons. Generate file or copy from imac@home
import {Products} from '../Products';
import {validateDateNotInFuture} from '../date-validator.directive';
import {NotificationService} from "../NotificationSerivce";


//40,77 Rp./kWh 14,49 Rp./kWh --> 28.12.2022
const HIGH_RATE = 0.4077;
const LOW_RATE = 0.1449;

var optionsForCSVExport = {
  showLabels: true,
  showTitle: true,
  title: 'Abrechnung Ladestationen Tiechestrasse',
  headers: ["name", "users", "totalCostsInPeriod"],
  useHeader: true,
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['../app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SecureComponent implements OnInit {

  timePeriodForm!: UntypedFormGroup;
  from: Date = new Date(0);
  to: Date = new Date(0);
  toInLocalTime: Date = new Date(0);
  currentUser = '';
  isLoadingResults: boolean = false;
  displayedColumns: string[] = ['name', 'users', 'totalConsumption', 'totalConsumptionKWhLowRate', 'totalConsumptionKWhHighRate', 'totalConsumptionEligibleForSolar', 'totalCostsInPeriod'];
  chargers: Charger[] = [];
  personalChargers: string[] = [];
  userRole: number = 0;
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService, private esaeeApi: EaseeApiService,
              private router: Router,
              private formBuilder: UntypedFormBuilder,
              private notifications: NotificationService) { }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.authService.secured()
      .subscribe((data: User) => {
        this.currentUser = data.firstName + " " + data.lastName;
        this.isLoadingResults = false;
      });

    this.timePeriodForm = this.formBuilder.group({
      from: new FormControl(this.to, [
        Validators.required,
        validateDateNotInFuture()
      ]),
      to: new FormControl(this.to, [
        Validators.required,
        validateDateNotInFuture()
      ])
    });
  }

  onFormSubmit(): void {
    this.from = new Date(this.timePeriodForm.value.from + "T00:00:00Z");
    this.to = new Date(this.timePeriodForm.value.to + "T23:59:59Z");
    let substract = this.to.getTimezoneOffset()*60*1000*-1;
    this.toInLocalTime = new Date(this.to.getTime() - substract);


    //check if we deal with a normal user or a site admin
    this.esaeeApi.getProducts().subscribe((data: Products[]) => {
      data[0].circuits[0].chargers.forEach((charger) => {
        this.personalChargers.push(charger.id);
        this.userRole = charger.userRole;
      });
      //load data for all or just the personal chargers
      this.loadData(this.from.toISOString(), this.to.toISOString());
    });
  }

  onExport(): void {
    new AngularCsv(this.chargers, "AbrechnungLadestationen", optionsForCSVExport);
  }

  /**
   * internal use only to create the chargers to users map (see: ChargersWithUsers.ts)
   * There is a button in the html file, which is commented
   */
  mapChargerToPermissionData(): void {
    //creates http get observables for all charger stations
    let observables = this.chargerIDs().map((id: string) => {
      return this.esaeeApi.getChargerPermissions(id);
    });
    let result: Charger[] = [];
    //rxjs function that waits until all observables are done and the result comes in the same order as the array was passed as argument
    forkJoin(observables).pipe(map(response => {
      //array map where the index serves as lookup for the corresponding charger object which is in same order
      response.map((permissions: Permission[], index: number) => {
        let charger = allChargers[index];
        charger.permissions = permissions
        result.push(charger);
      });
      return result;
    })).subscribe((data) => console.log(JSON.stringify(data)));
  }


  loadData(from: string, to: string): void {
    this.isLoadingResults = true;
    let observables = this.chargerIDs().map((id: string) => {
      return this.esaeeApi.getChargerConsumption(id, from, to);
    });
    let result: Charger[] = [];
    forkJoin(observables).pipe(map(response => {
      //array map where the index serves as lookup for the corresponding charger object which is in same order
      response.map((powerUsage: PowerUsage[], index: number) => {
        let charger = allChargers[index];
        charger.powerUsage = checkTimeForHighRate(powerUsage)
        charger.users = getUsers(charger.permissions);
        sumCosts(charger);
        charger.totalConsumption = charger.totalConsumptionKWhLowRate + charger.totalConsumptionKWhHighRate;
        result.push(charger);
      });
      return result;
    })).subscribe({
      next: (data) => this.handleData(data),
      error: (e) => this.handleError(e),
      complete: () => console.info('complete')
    });
  }

  handleData(data: Charger[]) {
    data = data.sort(sortChargersByPPNumber);
    data = data.filter(data => data.totalCostsInPeriod > 0);
    if (data.length == 0) {
      this.notifications.showError("Keine Daten gefunden. Stimmt die Zeitperiode?");
    }
    this.chargers = data;
    this.isLoadingResults = false;
  }

  handleError(e: any) {
    this.notifications.showError(e);
    this.isLoadingResults = false;
  }

  chargerIDs(): Array<string> {
    //site admin has role == 1
    if (this.userRole == 1) {
      return allChargers.map(elem => elem.id)
    }
    return this.personalChargers;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(_ => console.log('Logout'));
  }

  getTotalConsumptionHighRate() {
    return this.chargers.map(charger => charger.totalConsumptionKWhHighRate).reduce((sum, value) => sum + value, 0);
  }

  getTotalConsumptionLowRate() {
    return this.chargers.map(charger => charger.totalConsumptionKWhLowRate).reduce((sum, value) => sum + value, 0);
  }

  getTotalConsumptionEligibleForSolar() {
    return this.chargers.map(charger => charger.totalConsumptionEligibleForSolar).reduce((sum, value) => sum + value, 0);
  }

  getTotalCostInPeriod() {
    return this.chargers.map(charger => charger.totalCostsInPeriod).reduce((sum, value) => sum + value, 0);
  }

}

function getUsers(permissions: Permission[]) {
  return permissions.map(entry => entry.name).join(",");
}

function sortChargersByPPNumber(a: Charger, b: Charger) {
  // @ts-ignore
  let ppNumberA = a.name.match(/\d+/).shift();
  // @ts-ignore
  let ppNumberB = b.name.match(/\d+/).shift();
  // @ts-ignore
  if (ppNumberA < ppNumberB) {
    return -1;
  }
  // @ts-ignore
  if (ppNumberA > ppNumberB) {
    return 1;
  }
  return 0;
}

function checkTimeForHighRate(powerUsage: PowerUsage[]): PowerUsage[] {
  powerUsage.forEach(element => {
    let localTime = new Date(element.from).toLocaleTimeString();
    switch (localTime) {
      case "09:00:00":
        element.highRate = false;
        element.solarPower = true;
        break;
      case "10:00:00":
        element.highRate = false;
        element.solarPower = true;
        break;
      case "11:00:00":
        element.highRate = true;
        element.solarPower = true;
        break;
      case "12:00:00":
        element.highRate = true;
        element.solarPower = true;
        break;
      case "13:00:00":
        element.highRate = false;
        element.solarPower = true;
        break;
      case "14:00:00":
        element.highRate = false;
        element.solarPower = true;
        break;
      case "15:00:00":
        element.highRate = false;
        element.solarPower = true;
        break;
      case "16:00:00":
        element.highRate = false;
        element.solarPower = false;
        break;
      case "18:00:00":
        element.highRate = true;
        element.solarPower = false;
        break;
      case "19:00:00":
        element.highRate = true;
        element.solarPower = false;
        break;
      default:
        element.highRate = false;
        element.solarPower = false;
        break;
    }
  });
  return powerUsage;
}

function sumCosts(charger: Charger) {
  let sum = 0;
  let kWhHigh = 0;
  let kWhLow = 0;
  let solarPower = 0;
  charger.powerUsage.forEach(entry => {
    if (entry.totalEnergy > 0) {
      if (entry.highRate) {
        sum += entry.totalEnergy * HIGH_RATE;
        kWhHigh += entry.totalEnergy;
      } else {
        sum += entry.totalEnergy * LOW_RATE
        kWhLow += entry.totalEnergy;
      }
      if (entry.solarPower) {
        solarPower += entry.totalEnergy;
      }
    }
  });
  charger.totalConsumptionKWhHighRate = kWhHigh;
  charger.totalConsumptionKWhLowRate = kWhLow;
  charger.totalCostsInPeriod = sum;
  charger.totalConsumptionEligibleForSolar = solarPower;
}

