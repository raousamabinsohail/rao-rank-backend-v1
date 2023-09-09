import { IntersectionType } from "@nestjs/swagger";

export class Question {
    questionCode: string;
    questionText: string;
    type:string;
    pageBreak: boolean;
    separator: boolean;
    active?:boolean;
    meta: any;
}

export class UpdateQuestionDto extends IntersectionType(Question) {
    _id: string;
}

export class Survey {
    name: string;
    type: string[];
    status: string;
    startDate: string;
    endDate: string;
    comments: string;
    accessType: string;
    headerImage?: string;
    attendees?:string[];
    footerText?: string;
    thankyouPageText?: string;
    questions?: Array<Question>;
    order:number;
    attempts:number;
    active?:boolean;
}

export class UpdateSurveyDto extends IntersectionType(Survey) {
    _id: string;
    questions?: UpdateQuestionDto[];
}