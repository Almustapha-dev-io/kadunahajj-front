import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IBreakpoints } from '../common/IBreakpoints';

export class AppBreakPointsObserver {

  breakpoints: IBreakpoints;
  filesToUpload = [
    { value: 'passportPhoto', display: 'Passport Image' },
    { value: 'signature', display: 'Signature' },
    { value: 'identificationDocument', display: 'Gov\'t Issued ID' },
    { value: 'evidenceOfAddress', display: 'Evidence of Address (Not more than Three (3) Months Old)' },
  ];

  acceptedDocuments = [
    { value: 'nationalId', display: 'Natoinal ID Card' },
    { value: 'pvc', display: 'Permanent Voters Card' },
    { value: 'internationalPassport', display: 'International Passport' },
    { value: 'driversLicense', display: 'Driver\'s License' },
    { value: 'birthCertificate', display: 'Birth Certificate/Sworn Declaration of Age' },
  ];
  acceptedUtilityDocs = [
    { value: 'utilityBill', display: 'Utility Bill (Electricity, Water, Waste, Telephone, Gas/Energy)' },
    { value: 'tenancyAgreement', display: 'Valid Tenancy Agreement' },
    { value: 'driversLicense', display: 'Valid Driver\'s License' },
    { value: 'bankStatement', display: 'Valid Bank Statement Showing Current Address (stamped & signed)' },
    { value: 'estateDues', display: 'Estate Dues and Payment of Internet Charges' },
  ];

  natureOfBusinesses = [
    { value: '001', display: 'Advertising, Media & Communications' },
    { value: '002', display: 'Agriculture, Fishing & Forestry' },
    { value: '003', display: 'Automotive & Aviation' },
    { value: '004', display: 'Banking, Finance & Insurance' },
    { value: '005', display: 'Construction' },
    { value: '006', display: 'Education' },
    { value: '007', display: 'Energy & Utilities' },
    { value: '008', display: 'Enforcement & Security' },
    { value: '009', display: 'Entertainment, Events & Sport' },
    { value: '010', display: 'Healthcare' },
    { value: '011', display: 'Hospitality &Hotel' },
    { value: '012', display: 'IT & Telecoms' },
    { value: '013', display: 'Law & Compliance' },
    { value: '014', display: 'Manufacturing & Warehousing' },
    { value: '015', display: 'Mining, Energy & Metals' },
    { value: '016', display: 'NGO, NPO & Charity' },
    { value: '017', display: 'Real Estate' },
    { value: '018', display: 'Recruitment' },
    { value: '019', display: 'Retail, Fashion & FMCG' },
    { value: '020', display: 'Shipping & Logistics' },
    { value: '021', display: 'Tourism & Travel' },
  ];

  genders = [
    { value: 'Male--M', display: 'Male'},
    { value: 'Female--F', display: 'Female'}
  ];

  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  setScreenOrientations(): void {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ]).subscribe(result => {

      console.log(result);

      const breakpoints = result.breakpoints;
      this.breakpoints = {
      isMobilePortrait: breakpoints['(max-width: 599.99px) and (orientation: portrait)'],
      isMobileLandscape: breakpoints['(max-width: 959.99px) and (orientation: landscape)'],
      isTabletPortrait: breakpoints['(min-width: 600px) and (max-width: 839.99px) and (orientation: portrait)'],
      isTabletLandscape: breakpoints['(min-width: 840px) and (orientation: portrait)'],
      isBigScreenPortrait: breakpoints['(min-width: 960px) and (max-width: 1279.99px) and (orientation: landscape)'],
      isBigScreenLandscape: breakpoints['(min-width: 1280px) and (orientation: landscape)']
      }
    });
  }

  get isMobilePortrait(): boolean {
    return this.breakpoints.isMobilePortrait;
  }

  get isMobileLandscape(): boolean {
    return this.breakpoints.isMobileLandscape;
  }

  get isTabletPortrait(): boolean {
    return this.breakpoints.isTabletPortrait;
  }

  get isTabletLandscape(): boolean {
    return this.breakpoints.isTabletLandscape;
  }

  get isBigScreenPortrait(): boolean {
    return this.breakpoints.isBigScreenPortrait;
  }

  get isBigScreenLandscape(): boolean {
    return this.breakpoints.isBigScreenLandscape;
  }

  get cardWidth(): string {

    if (this.isBigScreenLandscape || this.isBigScreenPortrait || this.isTabletLandscape)
      return '565px';

    if (this.isTabletPortrait || this.isMobileLandscape) return '400px';

    if (this.isMobilePortrait) return '90%';
  }
}
