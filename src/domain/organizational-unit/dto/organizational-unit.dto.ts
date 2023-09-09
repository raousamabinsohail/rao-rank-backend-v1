import { IntersectionType } from "@nestjs/swagger";
import { Types } from "mongoose";

/**
 *
 * class for Organizational Units
 * @export
 * @class OrganizationalUnit
 */
export class OrganizationalUnit {
    name: string
    parent: Types.ObjectId;
    category: Types.ObjectId;
    type: Types.ObjectId;
    location: Types.ObjectId;
    image: string;
    image_sq: string;
    isManager: boolean;
    active: boolean;
    id?: number;
};


/**
 *
 *
 * @export
 * @class UpdateOUDto
 * @extends {IntersectionType(OrganizationalUnit, OUWithID)}
 */
export class UpdateOUDto extends IntersectionType(OrganizationalUnit) {
    _id: string
}