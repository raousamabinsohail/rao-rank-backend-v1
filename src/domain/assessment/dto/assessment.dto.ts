import { IntersectionType } from "@nestjs/swagger";



export class Assessment {
    name: string;
    description: string;
    type: string;
}


export class UpdateAssessment extends IntersectionType(Assessment) {
    _id:string;
}