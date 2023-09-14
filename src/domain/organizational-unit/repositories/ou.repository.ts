import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { OrganizationalUnit, UpdateOUDto } from "../dto/organizational-unit.dto";
import { Injectable } from "@nestjs/common";
import { OURepository } from "../interfaces/ou-repository.interface";
import { SearchHistory } from "../dto/search-history.dto";



/**
 *
 *
 * @export
 * @class OURepositoryImpl
 * @implements {OURepository}
 */
@Injectable()
export class OURepositoryImpl implements OURepository {
  constructor(
    @InjectModel("Organizational-Unit") private readonly ouModal: Model<OrganizationalUnit>,
    @InjectModel("search-history") private readonly shModel: Model<SearchHistory>
  ) { }


  //Search category by keyword
  public async searchCategory(keyword: string, categoryId?: number): Promise<OrganizationalUnit[]> {

    let match = {};

    if (categoryId) {
      match["id"] = categoryId;
    }

    const pipe = [
      {
        $match: match,
      },
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "children",
          depthField: "depth",
        },
      },
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$parent",
          connectFromField: "parent",
          connectToField: "_id",
          as: "parents",
          depthField: "depth",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $lookup: {
          from: "org-types",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      {
        $lookup: {
          from: "org-categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          location: {
            $first: "$location",
          },
          type: {
            $first: "$type",
          },
          category: {
            $first: "$category",
          },
        },
      },
      {
        $addFields: {
          string: {
            $concatArrays: ["$children._id", ["$_id"]],
          },
        },
      },
      {
        $lookup: {
          from: "data",
          localField: "string",
          foreignField: "ous",
          pipeline: [
            {
              $match: {
                $or: [
                  { name: { $regex: keyword, $options: "i" } },
                  { "fields.name": { $regex: keyword, $options: "i" } },
                  { "fields.data": { $regex: keyword, $options: "i" } },
                ],
              },
            },
            {
              $graphLookup: {
                from: "organization-units",
                startWith: "$ous",
                connectFromField: "parent",
                connectToField: "_id",
                depthField: "depth",
                as: "breadcrumbs",
              },
            },
            {
              $addFields: {
                breadcrumbs: {
                  $map: {
                    input: "$breadcrumbs",
                    in: {
                      label: "$$this.name",
                      id: "$$this.id",
                      icon: "$$this.image_sq",
                      depth: "$$this.depth",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "data-types",
                localField: "type",
                foreignField: "_id",
                as: "type",
              },
            },
            {
              $addFields: {
                type: {
                  $first: "$type",
                },
              },
            },
            {
              $unwind: {
                path: "$fields",
              },
            },
            {
              $lookup: {
                from: "field-types",
                localField: "fields.type",
                foreignField: "_id",
                as: "fields.type",
              },
            },
            {
              $lookup: {
                from: "data-fields",
                localField: "fields.label",
                foreignField: "name",
                as: "fields.field",
              },
            },
            {
              $addFields: {
                "fields.type": {
                  $first: "$fields.type",
                },
                "fields.label": {
                  $ifNull: [
                    {
                      $first: "$fields.field",
                    },
                    "$fields.label",
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$_id",
                id: {
                  $first: "$id",
                },
                name: {
                  $first: "$name",
                },
                type: {
                  $first: "$type",
                },
                fields: {
                  $addToSet: "$fields",
                },
                ous: {
                  $first: "$ous",
                },
                active: {
                  $first: "$active",
                },
                comments: {
                  $first: "$comments",
                },
                breadcrumbs: {
                  $first: "$breadcrumbs",
                },
                updatedAt: {
                  $first: "$updatedAt",
                },
              },
            },
          ],
          as: "data_items",
        },
      },
      {
        $addFields: {
          score: {
            $sum: "$data_counter.count",
          },
        },
      },
      {
        $unset: "string",
      },
    ];

    return this.ouModal.aggregate(pipe);
  }


  //Create search history log
  public async createSearchHistory(searchHistory: SearchHistory): Promise<SearchHistory> {
    return this.shModel.create(searchHistory);
  }

  public async getByCategoryId(id: number): Promise<any> {
    let pipe = [
      {
        '$match': {
          'id': Number(id)
        }
      }, {
        '$graphLookup': {
          'from': 'organization-units', 
          'startWith': '$parent', 
          'connectFromField': 'parent', 
          'connectToField': '_id', 
          'as': 'breadcrumbs', 
          'depthField': 'depth'
        }
      }, {
        '$lookup': {
          'from': 'organization-units', 
          'localField': '_id', 
          'foreignField': 'parent', 
          'as': 'children'
        }
      }, {
        '$lookup': {
          'from': 'organization-units', 
          'localField': 'parent', 
          'foreignField': '_id', 
          'as': 'parent'
        }
      }, {
        '$addFields': {
          'parent': {
            '$ifNull': [
              {
                '$first': '$parent'
              }, null
            ]
          }
        }
      }
    ];

    return await this.ouModal.aggregate(pipe).exec();
  }

  //Create 
  public async getParentID(query: any): Promise<any> {
    try {
      let pipeline = [
        {
          '$lookup': {
            'from': 'organization-units',
            'localField': 'parent',
            'foreignField': '_id',
            'as': 'parent'
          }
        }, {
          '$addFields': {
            'parent': {
              '$ifNull': [
                {
                  '$first': '$parent.name'
                }, null
              ]
            }
          }
        }, {
          '$match': {
            'name': query.name,
            'parent': query.parent
          }
        }
      ]

      let res = await this.ouModal.aggregate(pipeline).exec();

      return res


    } catch (error) {
      throw new Error(error)
    }
  }


  //Get search history
  public async getSearchHistory(uid: string): Promise<string[]> {
    return await this.shModel.aggregate([{
      '$group': {
        '_id': '$keyword',
        'count': {
          '$count': {}
        }
      }
    }, {
      '$match': {
        '_id': {
          '$ne': null
        }
      }
    }, {
      '$sort': {
        'count': -1
      }
    }, {
      '$limit': 15
    }])

    // // return (await this.shModel.find({ user_id: uid })
    //   .sort({ createdAt: -1 })
    // //   .limit(15).exec()).map((e: SearchHistory) => e.keyword);
  }


  //Get all ous without parent
  public async getWithoutParent(): Promise<OrganizationalUnit[]> {
    try {
      return this.ouModal.aggregate([
        {
          '$match': {
            'parent': null
          }
        },
        {
          $graphLookup: {
            from: "organization-units",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent",
            as: "children",
            depthField: "depth",
          }
        },
        {
          '$lookup': {
            'from': 'org-types',
            'localField': 'type',
            'foreignField': '_id',
            'as': 'type'
          }
        }, {
          '$unwind': {
            'path': '$type',
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$match': {
            // 'type.name': {
            //   '$in': [
            //     'entity', 'ministry'
            //   ]
            // }
          }
        }
      ])
    } catch (error) {
      throw new Error(error)
    }
  }


  //Get ous with children
  public async getWithChildren(): Promise<any> {
    const pipe = [
      {
        $match: {
          parent: null,
        },
      },
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "children",
          depthField: "depth",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $lookup: {
          from: "org-types",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      {
        $lookup: {
          from: "org-categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          location: {
            $first: "$location",
          },
          type: {
            $first: "$type",
          },
          category: {
            $first: "$category",
          },
        },
      },
    ];

    return await this.ouModal.aggregate(pipe);

  }

  //Get ous with children
  public async getWithGraph(query: any): Promise<any> {

    if (query.id) {
      query.id = Number(query.id);
    }

    const pipe = [
      {
        $match: query,
      },
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "children",
          depthField: "depth",
        },
      },
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$parent",
          connectFromField: "parent",
          connectToField: "_id",
          as: "parents",
          depthField: "depth",
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $lookup: {
          from: "org-types",
          localField: "type",
          foreignField: "_id",
          as: "type",
        },
      },
      {
        $lookup: {
          from: "org-categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          location: {
            $first: "$location",
          },
          type: {
            $first: "$type",
          },
          category: {
            $first: "$category",
          },
        },
      },
      {
        $addFields: {
          string: {
            $concatArrays: ["$children._id", ["$_id"]],
          },
        },
      },
      {
        $lookup: {
          from: "data",
          localField: "string",
          foreignField: "ous",
          pipeline: [
            {
              $graphLookup: {
                from: "organization-units",
                startWith: "$ous",
                connectFromField: "parent",
                connectToField: "_id",
                depthField: "depth",
                as: "breadcrumbs",
              },
            },
            {
              $addFields: {
                breadcrumbs: {
                  $map: {
                    input: "$breadcrumbs",
                    in: {
                      label: "$$this.name",
                      id: "$$this.id",
                      icon: "$$this.image_sq",
                      depth: "$$this.depth",
                    },
                  },
                },
              },
            },
            {
              $lookup: {
                from: "data-types",
                localField: "type",
                foreignField: "_id",
                as: "type",
              },
            },
            {
              $addFields: {
                type: {
                  $first: "$type",
                },
              },
            },
            {
              $unwind: {
                path: "$fields",
              },
            },
            {
              $lookup: {
                from: "field-types",
                localField: "fields.type",
                foreignField: "_id",
                as: "fields.type",
              },
            },
            {
              $lookup: {
                from: "data-fields",
                localField: "fields.label",
                foreignField: "name",
                as: "fields.field",
              },
            },
            {
              $addFields: {
                "fields.type": {
                  $first: "$fields.type",
                },
                "fields.label": {
                  $ifNull: [
                    {
                      $first: "$fields.field",
                    },
                    "$fields.label",
                  ],
                },
              },
            },
            {
              $group: {
                _id: "$_id",
                id: {
                  $first: "$id",
                },
                name: {
                  $first: "$name",
                },
                type: {
                  $first: "$type",
                },
                fields: {
                  $addToSet: "$fields",
                },
                ous: {
                  $first: "$ous",
                },
                active: {
                  $first: "$active",
                },
                comments: {
                  $first: "$comments",
                },
                breadcrumbs: {
                  $first: "$breadcrumbs",
                },
                updatedAt: {
                  $first: "$updatedAt",
                },
              },
            },
          ],
          as: "data_items",
        },
      },
      {
        $addFields: {
          score: {
            $sum: "$data_counter.count",
          },
        },
      },
      {
        $unset: "string",
      },
    ];
    return await this.ouModal.aggregate(pipe);

  }

  //create Organizational unit Implementation
  public async create(ou: OrganizationalUnit): Promise<OrganizationalUnit> {
    if (!ou.id || ou.id == null) {

      let pipe = [
        {
          $group: {
            _id: null,
            id: { $max: "$id" }
          }
        }
      ]
      let last = await this.ouModal.aggregate(pipe).exec();
      console.log(last)
      if (last && last[0].id != null) {
        console.log('INSIDE LAST')
        ou.id = last[0].id ? last[0].id + 1 : 0 ;
      } else {
        throw new Error('ID not fetched')
      }
    }
    return await this.ouModal.create(ou);
  }
  //get all Organizational units Implementation
  public async getAll(): Promise<OrganizationalUnit[]> {
    return await this.ouModal.find().populate('location').populate('type').populate('category').populate('parent');
  }
  //update Organizational unit Implementation
  public async update(ou: UpdateOUDto): Promise<OrganizationalUnit> {
    return await this.ouModal.findByIdAndUpdate(ou._id, ou, { new: false }).exec();
  }
  //delete Organizational unit Implementation
  public async delete(_id: string): Promise<any> {
    return await this.ouModal.findByIdAndDelete(_id).exec();
  }

  public async clean(): Promise<any> {
    const pipe: any = [
      {
        $graphLookup: {
          from: "organization-units",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "string",
        },
      },
      {
        $addFields: {
          string: {
            $concatArrays: ["$string._id", ["$_id"]],
          },
        },
      },
      {
        $lookup: {
          from: "data",
          localField: "string",
          foreignField: "ous",
          pipeline: [
            {
              $lookup: {
                from: "data-types",
                localField: "type",
                foreignField: "_id",
                as: "type",
              },
            },
            {
              $addFields: {
                type: {
                  $first: "$type",
                },
              },
            },
            {
              $group: {
                _id: "$type.arabic",
                count: {
                  $count: {},
                },
                icon: {
                  $first: "$type.icon",
                },
              },
            },
          ],
          as: "data_counter",
        },
      },
      {
        $addFields: {
          score: {
            $sum: "$data_counter.count",
          },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $unset: "string",
      },
      {
        $out: "organization-units",
      },
    ];

    return await this.ouModal.aggregate(pipe);
  }
}