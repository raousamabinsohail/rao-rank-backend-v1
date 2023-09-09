import { IntersectionType } from "@nestjs/swagger";




export class SurveyType {
    name: string;
    active?: boolean;
}

export class UpdateSurveyTypeDto extends IntersectionType(SurveyType) {
    _id: string;
}