import { IntersectionType } from "@nestjs/swagger";
import { OrganizationalUnit } from "src/domain/organizational-unit/dto/organizational-unit.dto";


export class COption {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
}

export class AOption {
    allow: boolean;
    disallow: boolean;
}

export class Option {
    type: string;
    options: COption | AOption;
}

//Child interfaces
export class Child {
    name: string;
    ouRequired: boolean;
    arabic: string;
    ou: OrganizationalUnit | string;
    options: Option;
}

export class Parent {
    name: string;
    ouRequired: boolean;
    ou: OrganizationalUnit | string;
    ouLabel: string;
    options: Option;
    children: Array<Child>;
    arabic: string;
}

export class Permission {
    name: string;
    permissions: Array<Parent>;
    active: boolean;
}

export class UpdatePermissionDto extends IntersectionType(Permission){
    _id:string;
}