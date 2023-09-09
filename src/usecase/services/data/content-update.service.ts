import { Inject, Injectable } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ContentUpdate, UpdateContentUpdate } from 'src/domain/data/dto/content-update.dto';
import { ContentUpdateRepository } from 'src/domain/data/interfaces/content-update-repository.interface';

import { GenericResponse } from 'src/domain/dto/generic';

@Injectable()
export class ContentUpdateService {

  constructor(@Inject('ContentUpdateRepository') private contentUpdateRepository: ContentUpdateRepository) { }

  public async getAll(page, offset): Promise<GenericResponse<ContentUpdate[]>> {
    const res = await this.contentUpdateRepository.getAll(page, offset);

    const response: GenericResponse<ContentUpdate[]> = {
      success: true,
      message: 'Content update log fetched Successfully',
      data: res,
    };
    return response;
  }


  public async create(data: ContentUpdate): Promise<GenericResponse<ContentUpdate>> {
    const res = await this.contentUpdateRepository.create(data)

    const response: GenericResponse<ContentUpdate> = {
      success: true,
      message: 'Content update log added Successfully',
      data: res,
    };
    return response;
  }


  public async update(data: UpdateContentUpdate): Promise<GenericResponse<ContentUpdate>> {
    const res = await this.contentUpdateRepository.update(data);

    const response: GenericResponse<ContentUpdate> = {
      success: true,
      message: 'Content update log updated Successfully',
      data: res,
    };
    return response;
  }

  public async getView(status: string, page: number, offset: number): Promise<GenericResponse<ContentUpdate[]>> {

    let pipe = [
      {
        '$match': {
          'status': status
        }
      }, {
        '$addFields': {
          'service_id': {
            '$ifNull': [
              '$service_id', {
                '$concat': [
                  '$after.name', '-', '$after.ous'
                ]
              }
            ]
          }
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'updated_by',
          'foreignField': '_id',
          'as': 'updated_by'
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'approved_by',
          'foreignField': '_id',
          'as': 'approved_by'
        }
      }, {
        '$addFields': {
          'updated_by': {
            '$ifNull': [
              {
                '$first': '$updated_by'
              }, 'no user found'
            ]
          },
          'approved_by': {
            '$ifNull': [
              {
                '$first': '$approved_by'
              }, 'no user found'
            ]
          }
        }
      }, {
        '$group': {
          '_id': '$service_id',
          'content_updates': {
            '$addToSet': {
              '_id': '$_id',
              'status': '$status',
              'type': '$type',
              'before': '$before',
              'after': '$after',
              'service_id': '$service_id',
              'updated_by': '$updated_by',
              'approved_by': '$approved_by',
              'reject_reason': '$reject_reason',
              'updatedAt': '$updatedAt',
              'createdAt': '$createdAt',
              'adminChange': '$adminChange'
            }
          },
          'ous': {
            '$first': '$ous'
          }
        }
      }, {
        '$graphLookup': {
          'from': 'organization-units',
          'startWith': '$ous',
          'connectFromField': 'parent',
          'connectToField': '_id',
          'depthField': 'depth',
          'as': 'breadcrumbs'
        }
      }, {
        '$lookup': {
          'from': 'data',
          'localField': '_id',
          'foreignField': '_id',
          'as': 'service'
        }
      }, {
        '$addFields': {
          'id': {
            '$ifNull': [
              {
                '$first': '$service.id'
              }, null
            ]
          },
          'name': {
            '$ifNull': [
              {
                '$first': '$service.name'
              }, {
                '$first': '$content_updates.after.name'
              }
            ]
          },
          'type': {
            '$ifNull': [
              {
                '$first': '$service.type'
              }, {
                '$toObjectId': {
                  '$first': '$content_updates.after.type'
                }
              }
            ]
          },
          'active': {
            '$ifNull': [
              {
                '$first': '$service.active'
              }, false
            ]
          },
          'updatedAt': {
            '$ifNull': [
              {
                '$first': '$service.updatedAt'
              }, null
            ]
          },
          'last_update': {
            '$max': '$content_updates.updatedAt'
          }
        }
      }, {
        '$match': {
          'id': {
            '$ne': null
          }
        }
      }, {
        '$lookup': {
          'from': 'data-types',
          'localField': 'type',
          'foreignField': '_id',
          'as': 'type'
        }
      }, {
        '$addFields': {
          'type': {
            '$first': '$type'
          },
          'service': {
            '$first': '$service'
          }
        }
      }, {
        '$sort': {
          'last_update': -1
        }
      }, {
        '$unset': 'ous'
      }
    ]

    const res = await this.contentUpdateRepository.executePipe(pipe);

    const response: GenericResponse<ContentUpdate[]> = {
      success: true,
      message: 'Content update log fetched Successfully',
      data: res,
    };
    return response;
  }

  public async delete(_id: string): Promise<GenericResponse<any>> {
    const res = await this.contentUpdateRepository.delete(_id);

    const response: GenericResponse<any> = {
      success: true,
      message: res.deletedCount > 0 ? 'Data field deleted Successfully' : 'Data field Id not found',
      data: res,
    };
    return response;
  }

  public async getOne(_id: string): Promise<GenericResponse<ContentUpdate>> {
    const res = await this.contentUpdateRepository.getOne(_id);

    const response: GenericResponse<any> = {
      success: true,
      message: res ? 'Data field fetched Successfully' : 'Data field not found',
      data: res,
    };

    return response;
  }

  public async approve(data: UpdateContentUpdate | any): Promise<GenericResponse<ContentUpdate>> {
    try {

      console.log("==> Approve Start", data)
      switch (data.type) {
        //If Data edit request is approved
        case 'EDIT':

          //updating service

          let editData = await this.contentUpdateRepository.updateData(data)

          //Retrieving older data
          let previousLog = await this.contentUpdateRepository.getOne(data._id)

          data.adminChange = { ...data.after }
          data.after.data = previousLog.after.data

          //Updating log
          let updateLog = await this.contentUpdateRepository.update(data);

          break;
        //If Add Data request is approved
        case 'ADD SERVICE':

          console.log("==> enter", data)

          if (data.id == null) {
            //Retrieving greatest Id
            const greatestID = await this.contentUpdateRepository.executeDataPipe([
              {
                $group: {
                  _id: null,
                  id: { $max: "$id" }
                }
              }
            ])
            data.after.id = greatestID[0].id + 1
          }

          //Retrieving older data
          let preLog = await this.contentUpdateRepository.getOne(data._id)

          //fields fo previous log
          let f1 = preLog.after.fields
          //fields on approval time
          let f2 = data.after.fields
          //Fields changed by the admin
          let changedFields = []

          // separating fields that are changes by the admin
          for (let i = 0; i < f1.length; i++) {
            const f1Obj = f1[i];
            const f2Obj = f2.filter(e => e.label == f1Obj.label)[0];

            if (f1Obj.data != f2Obj.data) {
              changedFields.push(f2Obj)
            }

          }

          // Creating data
          const addData = await this.contentUpdateRepository.createData(data.after);


          data.service_id = addData._id
          data.adminChange = { fields: changedFields }
          data.after = preLog.after

          let updateLog2 = await this.contentUpdateRepository.update(data);

          break
        case 'DELETE':
          const isUpdated = await this.contentUpdateRepository.deleteData(data)
          //Updating log
          let updateLog3 = await this.contentUpdateRepository.update(data);

          break;
        default:
          throw new Error("Invalid Log");
      }
      const response: GenericResponse<ContentUpdate> = {
        success: true,
        message: 'Changes Accepted Successfully',
        data: null,
      };
      return response;

    } catch (error) {
      throw new Error(error)
    }
  }

  public async reject(data: UpdateContentUpdate | any): Promise<GenericResponse<ContentUpdate>> {
    try {

      console.log("==> Approve Start", data)

      let updateLog = await this.contentUpdateRepository.update(data);

      const response: GenericResponse<ContentUpdate> = {
        success: true,
        message: 'Changes Rejected Successfully',
        data: null,
      };
      return response;

    } catch (error) {
      throw new Error(error)
    }
  }

}