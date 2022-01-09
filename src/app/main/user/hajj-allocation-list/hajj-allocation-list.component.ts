import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { LoaderService } from '../../../services/loader.service';

import { environment } from '@environment';
import { MatDialog } from '@angular/material/dialog';
import { NgModel } from '@angular/forms';
import { AddHajjAllocationComponent } from '../add-hajj-allocation/add-hajj-allocation.component';
import { ViewHajjAllocationComponent } from '../view-hajj-allocation/view-hajj-allocation.component';
import { MigrateHajjAllocationComponent } from '../migrate-hajj-allocation/migrate-hajj-allocation.component';
import { DeleteHajjAllocationComponent } from '../delete-hajj-allocation/delete-hajj-allocation.component';
import { EditHajjAllocationComponent } from '../edit-hajj-allocation/edit-hajj-allocation.component';
import { RoleServiceService } from 'src/app/services/role-service.service';


@Component({
    selector: 'app-hajj-allocation-list',
    templateUrl: './hajj-allocation-list.component.html',
    styleUrls: ['./hajj-allocation-list.component.scss']
})
export class HajjAllocationListComponent implements OnInit, OnDestroy {
    @ViewChild('yearId') yearId: NgModel;
    searchText = '';
    years = [];
    allocations = [];
    banks = [];
    p = 1;
    pageSize = 5;
    pages = [5, 10, 15, 20];
    totalItems = 0;

    subscription = new Subscription();
    token = sessionStorage.getItem('token');
    selectedYear = '';
    active = 'active';
    display = 'Active Allocations';

    constructor(
        public loader: LoaderService,
        private dataService: DataService,
        private notifications: NotificationService,
        private dialog: MatDialog,
        public rolesService: RoleServiceService
    ) { }

    ngOnInit(): void {
        this.getYears();
        // this.tabClick('active');
    }

    ngOnDestroy(): void {
        this.loader.hideLoader();
        this.subscription.unsubscribe();
    }

    onPageSizeChange() {
        this.onNavigate(1);
    }

    onNavigate(p?) {
        if (p) {
            this.p = p;
        }

        this.getAllocations(this.selectedYear, this.pageSize, this.p);
    }

    tabClick(change: string) {
        this.p = 1;
        this.pageSize = 5;
        this.allocations = [];
        this.active = change;

        switch (change) {
            case 'active':
                this.display = 'Active Allocations';
                break;

            case 'migrated':
                this.display = 'Migrated Allocations';
                break;

            default:
                this.display = 'Deleted Allocations';
                break;
        }

        this.getAllocations(this.selectedYear, this.pageSize, this.p);
    }

    yearSelected(yearId) {
        this.getAllocations(yearId);
    }

    getYears() {
        this.loader.showLoader();
        const uri = environment.years + '/all';

        this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
            this.years = [...response];
            this.loader.hideLoader();
        });
    }

    getAllocations(yearId, pageSize?, page?) {
        this.selectedYear = yearId;
        this.loader.showLoader();
        const uri = `${environment.allocations}/year/${yearId}/${this.active}`;
        const params = { pageSize, page };

        this.subscription = this.dataService.get(uri, this.token, null, params).subscribe(response => {
            this.allocations = [...response.allocations];
            this.totalItems = response.totalDocs;
            this.loader.hideLoader();
        });
    }

    addAllocation() {
        window.scroll(0, 0);
        this.dialog.open(AddHajjAllocationComponent, {
            width: '45rem',
            disableClose: true,
            data: {
                years: this.years
            }
        })
    }

    viewAllocation(a) {
        window.scroll(0, 0);
        this.dialog.open(ViewHajjAllocationComponent, {
            width: '45rem',
            disableClose: true,
            data: a
        });
    }
    
    editAllocation(a) {
        window.scroll(0, 0);
        this.dialog.open(EditHajjAllocationComponent, {
            width: '45rem',
            disableClose: true,
            data: a
        }).afterClosed().subscribe(r => r ? this.getAllocations(this.yearId.value, this.pageSize, this.p) : '');
    }

    deleteAllocation(a) {
        window.scroll(0, 0);
        this.dialog.open(DeleteHajjAllocationComponent, {
            width: '25rem',
            disableClose: true,
            data: a
        }).afterClosed()
            .subscribe(r => {
                if (r) {
                    this.notifications.successToast(`Allocation was deleted successfully.`);
                    this.yearSelected(this.yearId.value);
                    this.active = 'deleted';
                    this.display = 'Deleted Allocations';
                    this.p = 1;
                    this.getAllocations(this.yearId.value, this.pageSize, this.p);
                }
            });
    }

    migrateAllocation(allocation) {
        window.scroll(0, 0);
        this.dialog.open(MigrateHajjAllocationComponent, {
            width: '25rem',
            disableClose: true,
            data: {
                allocation,
                years: this.years.filter(y => y._id !== this.selectedYear)
            }
        }).afterClosed().subscribe(r => r ? this.getAllocations(this.yearId.value, this.pageSize, this.p) : '');
    }
}
