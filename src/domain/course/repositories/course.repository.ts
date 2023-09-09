import { Injectable } from "@nestjs/common";
import { CourseRepository } from "../interfaces/course-repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Model, UpdateWriteOpResult } from "mongoose";
import { Course, UpdateCourse } from "../dto/course.dto";
import { UpdateAssessment } from "src/domain/assessment/dto/assessment.dto";




@Injectable()
export class CourseRepositoryImpl implements CourseRepository {

    constructor(@InjectModel('course') private readonly assessmentModel: Model<Course>) { }

    public create(course: Course): Promise<Course> {
        return this.assessmentModel.create(course);
    }
    public getAll(): Promise<Course[]> {
        let pipe = [
            {
              '$lookup': {
                'from': 'session', 
                'localField': 'session', 
                'foreignField': '_id', 
                'as': 'session', 
                'pipeline': [
                  {
                    '$addFields': {
                      'typeId': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              {
                                '$type': '$typeId'
                              }, 'objectId'
                            ]
                          }, 
                          'then': '$typeId', 
                          'else': {
                            '$toObjectId': '$typeId'
                          }
                        }
                      }
                    }
                  }, {
                    '$addFields': {
                      'assessmentId': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              '$type', 'ASSESSMENT'
                            ]
                          }, 
                          'then': '$typeId', 
                          'else': null
                        }
                      }, 
                      'surveyId': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              '$type', 'SURVEY'
                            ]
                          }, 
                          'then': '$typeId', 
                          'else': null
                        }
                      }, 
                      'sessionId': {
                        '$cond': {
                          'if': {
                            '$eq': [
                              '$type', 'SESSION'
                            ]
                          }, 
                          'then': '$typeId', 
                          'else': null
                        }
                      }
                    }
                  }, {
                    '$lookup': {
                      'from': 'program', 
                      'localField': 'sessionId', 
                      'foreignField': '_id', 
                      'as': 'sessionId'
                    }
                  }, {
                    '$lookup': {
                      'from': 'surveys', 
                      'localField': 'surveyId', 
                      'foreignField': '_id', 
                      'as': 'surveyId'
                    }
                  }, {
                    '$lookup': {
                      'from': 'assessments', 
                      'localField': 'assessmentId', 
                      'foreignField': '_id', 
                      'as': 'assessmentId'
                    }
                  }, {
                    '$addFields': {
                      'sessionId': {
                        '$first': '$sessionId'
                      }, 
                      'assessmentId': {
                        '$first': '$assessmentId'
                      }, 
                      'surveyId': {
                        '$first': '$surveyId'
                      }
                    }
                  }, {
                    '$addFields': {
                      'typeId': {
                        '$ifNull': [
                          '$assessmentId', {
                            '$ifNull': [
                              '$surveyId', '$sessionId'
                            ]
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          ]
        return this.assessmentModel.aggregate(pipe);
    }
    public update(course: UpdateCourse): Promise<UpdateWriteOpResult> {
        let _id = course._id;
        delete course._id;
        return this.assessmentModel.updateOne({ _id }, { $set: course })
    }
    public delete(_id: string): Promise<any> {
        return this.assessmentModel.deleteOne({ _id });
    }
}