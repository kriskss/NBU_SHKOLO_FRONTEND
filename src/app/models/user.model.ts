import { Authorities } from './authorities.model';

export class User {
  accountNonLocked: boolean;
  address: string;
  birthDate: string;
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  firstName: string;
  id: number;
  lastName: string;
  phoneNumber: string;
  username: string;
  authorities: Authorities[];

  constructor(
    accountNonLocked: boolean,
    address: string,
    birthDate: string,
    credentialsNonExpired: boolean,
    email: string,
    enabled: boolean,
    firstName: string,
    id: number,
    lastName: string,
    phoneNumber: string,
    username: string,
    authorities: Authorities[]
  ) {
    this.accountNonLocked = accountNonLocked;
    this.address = address;
    this.birthDate = birthDate;
    this.credentialsNonExpired = credentialsNonExpired;
    this.email = email;
    this.enabled = enabled;
    this.firstName = firstName;
    this.id = id;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.username = username;
    this.authorities = authorities;
  }
}
