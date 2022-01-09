import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RoleServiceService {
    role = sessionStorage.getItem('roleName');

    constructor() { }

    get isAdmin() {
        return this.role === 'super-admin';
    }

    get isInitiator() {
        return this.role === 'initiator';
    }

    get isUserAdmin() {
        return this.role === 'admin';
    }

    get isReviewer() {
        return this.role === 'reviewer';
    }
}
