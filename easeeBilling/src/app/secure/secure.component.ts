import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {EaseeApiService} from "../easee-api.service";
import {forkJoin, map} from 'rxjs';
import {allChargers, Charger, Permission, PowerUsage} from "../Chargers";

//40,77 Rp./kWh 14,49 Rp./kWh --> 28.12.2022
const HIGH_RATE = 0.4077;
const LOW_RATE = 0.1449;

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['../app.component.css']
})
export class SecureComponent implements OnInit {

  getUsers(permissions: Permission[]) {
    return permissions.map(entry => entry.name).join(",");
  }

  message = '';
  isLoadingResults = false;
  chargers: Charger[] = [];

  constructor(private authService: AuthService, private esaeeApi: EaseeApiService, private router: Router) { }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.authService.secured()
      .subscribe((data: any) => {
        this.message = data;
        console.log(data);
        this.isLoadingResults = false;
      });
  }



  mapChargerToPerissionData(): void {
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


  loadData(): void {
    this.isLoadingResults = true;
    let from: string = "2022-12-01";
    let to: string = "2022-12-31";
    let observables = this.chargerIDs().map((id: string) => {
      return this.esaeeApi.getChargerConsumption(id, from, to);
    });
    let result: Charger[] = [];
    forkJoin(observables).pipe(map(response => {
      //array map where the index serves as lookup for the corresponding charger object which is in same order
      response.map((powerUsage: PowerUsage[], index: number) => {
        let charger = allChargers[index];
        charger.powerUsage = checkTimeForHighRate(powerUsage)
        sumCosts(charger);
        result.push(charger);
      });
      return result;
    })).subscribe((data) => {
      data = data.sort(sortChargersByPPNumber);
      data = data.filter(data => data.totalCostsInPeriod > 0);
      this.chargers = data;
      this.isLoadingResults = false;
    });
  }

  chargerIDs(): Array<string> {
    return allChargers.map(elem => elem.id)
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']).then(_ => console.log('Logout'));
  }

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
      if (entry.solarPower){
        solarPower += entry.totalEnergy;
      }
    }
  });
  charger.totalConsumptionKWhHighRate = kWhHigh;
  charger.totalConsumptionKWhLowRate = kWhLow;
  charger.totalCostsInPeriod = sum;
  charger.totalConsumptionEligibleForSolar = solarPower;
}

