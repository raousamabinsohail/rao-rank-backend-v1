import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OrganizationalUnitController } from './infrastructure/controllers/organizational-unit/organizational-unit.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from './domain/user-auth/entities/User.entity';
import { UserAuthService } from './usecase/services/user-auth/user-auth.service';
import { APP_GUARD } from '@nestjs/core';
import { UserRepositoryImpl } from './domain/user-auth/repositories/user.repository';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { UserAuthController } from './infrastructure/controllers/user-auth/user-auth.controller';
import moment from 'moment';
import 'moment-timezone';
import { OrganizationUnitsSchema } from './domain/organizational-unit/entities/organizational-unit.entity';
import { OURepositoryImpl } from './domain/organizational-unit/repositories/ou.repository';
import { LocationRepositoryImpl } from './domain/location/repositories/location.repository';
import { AuditSchema } from './domain/audit/entities/audit.enitity';
import { LogMiddleware } from './infrastructure/middleware/log.middleware';
import { AuditRepositoryImpl } from './domain/audit/repositories/audit.repository';
import { AuditService } from './usecase/services/audit/audit.service';
import { AuditController } from './infrastructure/controllers/audit/audit.controller';
import { AuditMiddleware } from './infrastructure/middleware/audit.middleware';
import { OuLocationSchema } from './domain/location/entities/location.entity';
import { OuCategorySchema } from './domain/ou-category/entities/ou-category.entity';
import { OuTypeSchema } from './domain/ou-type/entities/ou-type.entity';
import { OUCategoryRepositoryImpl } from './domain/ou-category/repositories/ou-category.repository';
import { OUTypeRepositoryImpl } from './domain/ou-type/repositories/ou-type.repository';
import { LocationController } from './infrastructure/controllers/location/location.controller';
import { OuTypeController } from './infrastructure/controllers/ou-type/ou-type.controller';
import { OuCategoryController } from './infrastructure/controllers/ou-category/ou-category.controller';
import { LocationService } from './usecase/services/location/location.service';
import { MailService } from './usecase/services/mail/mail.service';
import { OrganizationalUnitService } from './usecase/services/organizational-unit/organizational-unit.service';
import { OuCategoryService } from './usecase/services/ou-category/ou-category.service';
import { OuTypeService } from './usecase/services/ou-type/ou-type.service';
import { DataSchema } from './domain/data/entities/data.entity';
import { DataTypeSchema } from './domain/data/entities/data-type.entity';
import { DataFieldSchema } from './domain/data/entities/data-fields.entity';
import { FieldTypeSchema } from './domain/data/entities/field-type.entity';
import { DataTemplatesSchema } from './domain/data/entities/data-templates.entity';
import { DataController } from './infrastructure/controllers/data/data.contoller';
import { DataFieldController } from './infrastructure/controllers/data/data-field.controller';
import { DataService } from './usecase/services/data/data.service';
import { DataFieldService } from './usecase/services/data/data-fields.service';
import { DataFieldRepositoryImpl } from './domain/data/repositories/data-field.repository';
import { FieldTypeService } from './usecase/services/data/field-type.service';
import { FieldTypeController } from './infrastructure/controllers/data/field-type.controller';
import { FieldTypeRepositoryImpl } from './domain/data/repositories/field-type.repository';
import { DataTypeRepositoryImpl } from './domain/data/repositories/data-type.repository';
import { DataTypeService } from './usecase/services/data/data-type.service';
import { DataTypeController } from './infrastructure/controllers/data/data-type.controller';
import { DataTemplateService } from './usecase/services/data/data.template.service';
import { DataTemplateController } from './infrastructure/controllers/data/data-template.controller';
import { DataTemplateRepositoryImpl } from './domain/data/repositories/data-template.repository';
import { DataRepositoryImpl } from './domain/data/repositories/data.repository';
import { ContentUpdateRepositoryImpl } from './domain/data/repositories/content-update.repository';
import { ContentUpdateService } from './usecase/services/data/content-update.service';
import { ContentUpdateController } from './infrastructure/controllers/data/content-update.controller';
import { KLibrarySchema } from './domain/knowledge_library/entities/klibrary.entity';
import { KLibraryCategorySchema } from './domain/knowledge_library/entities/klibrary-category.entity';
import { KLIbraryRepositoryImpl } from './domain/knowledge_library/repositories/klibrary.repository';
import { KLIbraryCategoryRepositoryImpl } from './domain/knowledge_library/repositories/klibrary-category.repository';
import { KnowledgeLibraryService } from './usecase/services/knowledge-library/knowledge-library.service';
import { KnowledgeLibraryCategoryService } from './usecase/services/knowledge-library/knowledge-library-category.service';
import { KnowledgeLibraryController } from './infrastructure/controllers/knowledge-library/knowledge-library.controller';
import { KnowledgeLibraryCategoryController } from './infrastructure/controllers/knowledge-library/knowledge-library-category.controller';
import { FileService } from './usecase/services/file/file.service';
import { FileController } from './infrastructure/controllers/file/file.controller';
import { PermissionSchema } from './domain/permission/entities/permission.entity';
import { PermissionService } from './usecase/services/permission/permission.service';
import { PermissionRepositoryImpl } from './domain/permission/repositories/permission.repository';
import { PermissionController } from './infrastructure/controllers/permission/permission.controller';
import { RoleSchema } from './domain/role/entities/role.entity';
import { RoleRepositoryImpl } from './domain/role/repositories/role.repository';
import { RoleService } from './usecase/services/role/role.service';
import { RoleController } from './infrastructure/controllers/role/role.controller';
import { AuthorizationGuard } from './infrastructure/guards/authorization.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ContentUpdate } from './domain/data/dto/content-update.dto';
import { contentUpdate } from './domain/data/entities/content-update.entity';
import { SearchHistorySchema } from './domain/organizational-unit/entities/search-history.entity';
import { CommentSchema } from './domain/comments/entities/comment.entity';
import { CommentRepositoryImpl } from './domain/comments/repositories/comment.repository';
import { CommentsService } from './usecase/services/comments/comments.service';
import { CommentsController } from './infrastructure/controllers/comments/comments.controller';
import { JsonService } from './usecase/services/json/json.service';
import { MailLogSchema } from './domain/mail-logs/entities/mail-log.entity';
import { MailLogRepositoryImpl } from './domain/mail-logs/repositories/mail-log.repository';
import { ActiveUserSocketGateway } from './infrastructure/gateway/active-user-socket.gateway';
import { QuestionSchema, SurveySchema } from './domain/survey/entities/survey.entity';
import { SurveyTypeSchema } from './domain/survey/entities/survey-type.entity';
import { SurveyRepositoryImpl } from './domain/survey/repositories/survey.repository';
import { SurveyTypeRepositoryImpl } from './domain/survey/repositories/survey-type.repository';
import { SurveyService } from './usecase/services/survey/survey.service';
import { SurveyTypeService } from './usecase/services/survey/survey-type.service';
import { SurveyController } from './infrastructure/controllers/survey/survey.controller';
import { SurveyTypeController } from './infrastructure/controllers/survey/survey-type.controller';
import { TrainingRequestRepositoryImpl } from './domain/training/repositories/training-request.repository';
import { TrainingRequestService } from './usecase/services/training/training-request.service';
import { TrainingRequestController } from './infrastructure/controllers/training/training-request.controller';
import { TrainingRequestSchema } from './domain/training/entities/training.request.entity';
import { TrainingSchema } from './domain/training/entities/training.entity';
import { TrainingTypeSchema } from './domain/training/entities/trainingType.entity';
import { TrainingRepositoryImpl } from './domain/training/repositories/training.repository';
import { TrainingTypeRepositoryImpl } from './domain/training/repositories/training-type.repository';
import { TrainingService } from './usecase/services/training/training.service';
import { TrainingTypeService } from './usecase/services/training/training-type.service';
import { TrainingController } from './infrastructure/controllers/training/training.controller';
import { TrainingTypeController } from './infrastructure/controllers/training/training-type.controller';
import { AssessmentSchema } from './domain/assessment/entities/assessment.entity';
import { CourseSchema } from './domain/course/entities/course.entity';
import { AssessmentService } from './usecase/services/assessment/assessment.service';
import { CourseRepositoryImpl } from './domain/course/repositories/course.repository';
import { AssessmentRepositoryImpl } from './domain/assessment/repositories/assessment.repository';
import { CourseService } from './usecase/services/course/course.service';
import { CourseController } from './infrastructure/controllers/course/course.controller';
import { AssessmentController } from './infrastructure/controllers/assessment/assessment.controller';
import { SessionSchema } from './domain/course/entities/session.entity';
import { ProgramSchema } from './domain/course/entities/program.dto';
import { SessionRepositoryImpl } from './domain/course/repositories/session.repository';
import { ProgramRepositoryImpl } from './domain/course/repositories/program.repository';
import { SessionService } from './usecase/services/course/session.service';
import { ProgramService } from './usecase/services/course/program.service';
import { SessionController } from './infrastructure/controllers/course/session.controller';
import { ProgramController } from './infrastructure/controllers/course/program.controller';
import { DataDraftRepositoryImpl } from './domain/data/repositories/data-draft.repository';
import { StatesRepositoryImpl } from './domain/data/repositories/states-records.repository';
import { StatesService } from './usecase/services/data/states-record.service';
import { DataDraftService } from './usecase/services/data/data-draft.service';
import { StatesController } from './infrastructure/controllers/data/states-record.controller';
import { DataDraftController } from './infrastructure/controllers/data/data-draft.controller';
import { SurveyAttemptSchema } from './domain/survey/entities/survey-attempt.entity';
import { SurveyAttemptRepositoryImpl } from './domain/survey/repositories/survey-attempt.repository';

@Module({
  /**
   * Imports from other modules
   */
  imports: [

    /**
     * Config Module Registration to use process.env
     */
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),

    /**
     * Database Integration with
     * Database Schema declarations
     */
    MongooseModule.forRoot("mongodb+srv://rao:Golden123@reorank.gyhlll0.mongodb.net/?retryWrites=true&w=majority"!), //Server causing an issue with reading .env
    MongooseModule.forFeature([{ name: 'OU-Location', schema: OuLocationSchema, collection: 'locations' }]),
    MongooseModule.forFeature([{ name: 'OU-Category', schema: OuCategorySchema, collection: 'org-categories' }]),
    MongooseModule.forFeature([{ name: 'OU-Type', schema: OuTypeSchema, collection: 'org-types' }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'users' }]),
    MongooseModule.forFeature([{ name: 'Organizational-Unit', schema: OrganizationUnitsSchema, collection: 'organization-units' }]),
    MongooseModule.forFeature([{ name: 'Audit', schema: AuditSchema, collection: 'audit' }]),
    MongooseModule.forFeature([{ name: 'Data', schema: DataSchema, collection: 'data' }]),
    MongooseModule.forFeature([{ name: 'Data-Fields', schema: DataFieldSchema, collection: 'data-fields' }]),
    MongooseModule.forFeature([{ name: 'Field-Types', schema: FieldTypeSchema, collection: 'field-types' }]),
    MongooseModule.forFeature([{ name: 'Data-Templates', schema: DataTemplatesSchema, collection: 'data-templates' }]),
    MongooseModule.forFeature([{ name: 'Data-Type', schema: DataTypeSchema, collection: 'data-types' }]),
    MongooseModule.forFeature([{ name: 'view_data', schema: {}, collection: 'view_data' }]),
    MongooseModule.forFeature([{ name: 'view_content_updates', schema: {}, collection: 'view_content_updates' }]),
    MongooseModule.forFeature([{ name: 'content-updates', schema: contentUpdate, collection: 'content-updates' }]),
    MongooseModule.forFeature([{ name: 'knowledge-library', schema: KLibrarySchema, collection: 'knowledgeLibrary' }]),
    MongooseModule.forFeature([{ name: 'knowledge-library-category', schema: KLibraryCategorySchema, collection: 'knowledgeLibrary_categories' }]),
    MongooseModule.forFeature([{ name: 'Permission', schema: PermissionSchema, collection: 'permissions' }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema, collection: 'roles' }]),
    MongooseModule.forFeature([{ name: 'search-history', schema: SearchHistorySchema, collection: 'search_history' }]),
    MongooseModule.forFeature([{ name: 'comments', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'mail_logs', schema: MailLogSchema }]),
    MongooseModule.forFeature([{ name: 'survey', schema: SurveySchema }]),
    MongooseModule.forFeature([{ name: 'survey-type', schema: SurveyTypeSchema }]),
    MongooseModule.forFeature([{ name: 'survey-attempts', schema: SurveyAttemptSchema }]),
    MongooseModule.forFeature([{ name: 'questions', schema: QuestionSchema }]),
    MongooseModule.forFeature([{ name: 'Training_Request', schema: TrainingRequestSchema, collection: 'training_request' }]),
    MongooseModule.forFeature([{ name: 'Training', schema: TrainingSchema, collection: 'training' }]),
    MongooseModule.forFeature([{ name: 'Training_Type', schema: TrainingTypeSchema, collection: 'training-type' }]),
    MongooseModule.forFeature([{ name: 'assessment', schema: AssessmentSchema }]),
    MongooseModule.forFeature([{ name: 'course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema , collection: 'session' }]),
    MongooseModule.forFeature([{ name: 'Program', schema: ProgramSchema , collection: 'program'}]),
    MongooseModule.forFeature([{ name: 'Data_States', schema: ProgramSchema , collection: 'data_states'}]),
    MongooseModule.forFeature([{ name: 'Data_Draft', schema: ProgramSchema , collection: 'data_draft'}]),

    /**
     * JWT Module registration to work with JWT tokens
     */
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET
    }),

    /**
     * Mailer Module registration to send emails
     */
    MailerModule.forRoot({
      transport: {
        host: "reorank.com",
        secure: true,
        port: 465,
        auth: {
          user: "admin@reorank.com",
          pass: "golden125@"
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        }
      },
      defaults: {
        from: "admin@reorank.com"
      },
      template: {
        dir: join(__dirname, './dist/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }

    }),
  ],

  /**
   * Global functionality providers
   */
  providers: [
    /**
     * Abstract Interface repositories registration
     */
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: 'MomentWrapper',
      useValue: moment
    },
    {
      provide: 'OURepository',
      useClass: OURepositoryImpl
    },
    {
      provide: 'AuthRepository',
      useClass: UserRepositoryImpl
    },
    {
      provide: 'LocationRepository',
      useClass: LocationRepositoryImpl
    },
    {
      provide: 'AuditRepository',
      useClass: AuditRepositoryImpl
    },

    {
      provide: 'LocationRepository',
      useClass: LocationRepositoryImpl
    },
    {
      provide: 'OUCategoryRepository',
      useClass: OUCategoryRepositoryImpl
    },
    {
      provide: 'OUTypeRepository',
      useClass: OUTypeRepositoryImpl
    },
    {
      provide: 'DataFieldRepository',
      useClass: DataFieldRepositoryImpl
    },
    {
      provide: 'FieldTypeRepository',
      useClass: FieldTypeRepositoryImpl
    },
    {
      provide: 'DataTypeRepository',
      useClass: DataTypeRepositoryImpl
    },
    {
      provide: 'DataTemplateRepository',
      useClass: DataTemplateRepositoryImpl
    },
    {
      provide: 'DataRepository',
      useClass: DataRepositoryImpl
    },
    {
      provide: 'ContentUpdateRepository',
      useClass: ContentUpdateRepositoryImpl
    },
    {
      provide: 'KLibraryRepository',
      useClass: KLIbraryRepositoryImpl
    },
    {
      provide: 'KLibraryCategoryRepository',
      useClass: KLIbraryCategoryRepositoryImpl
    },
    {
      provide: 'PermissionRepository',
      useClass: PermissionRepositoryImpl
    },
    {
      provide: 'RoleRepository',
      useClass: RoleRepositoryImpl
    },
    {
      provide: 'CommentRepository',
      useClass: CommentRepositoryImpl
    },
    {
      provide: 'MailLogRepository',
      useClass: MailLogRepositoryImpl
    },
    {
      provide: 'SurveyRepository',
      useClass: SurveyRepositoryImpl
    },
    {
      provide: 'SurveyTypeRepository',
      useClass: SurveyTypeRepositoryImpl
    },
    {
      provide: 'TrainingRequestRepository',
      useClass: TrainingRequestRepositoryImpl
    },
    {
      provide: 'TrainingRepository',
      useClass: TrainingRepositoryImpl
    },
    {
      provide: 'TrainingTypeRepository',
      useClass: TrainingTypeRepositoryImpl
    },
    {
      provide: 'CourseRepository',
      useClass: CourseRepositoryImpl
    },
    {
      provide: 'AssessmentRepository',
      useClass: AssessmentRepositoryImpl
    },
    {
      provide: 'SessionRepository',
      useClass: SessionRepositoryImpl
    },
    {
      provide: 'ProgramRepository',
      useClass: ProgramRepositoryImpl
    },
    {
      provide: 'DataDraftRepository',
      useClass: DataDraftRepositoryImpl
    },
    {
      provide: 'StatesRepository',
      useClass: StatesRepositoryImpl
    },
    {
      provide: 'SurveyAttemptRepository',
      useClass: SurveyAttemptRepositoryImpl
    },
   

    /**
     * Directly injectable services without interface abstraction
     */

    MailService,
    OrganizationalUnitService,
    UserAuthService,
    OrganizationalUnitService,
    LocationService,
    LogMiddleware,
    AuditService,
    OuTypeService,
    OuCategoryService,
    DataService,
    DataFieldService,
    FieldTypeService,
    DataTypeService,
    DataTemplateService,
    ContentUpdateService,
    KnowledgeLibraryService,
    KnowledgeLibraryCategoryService,
    FileService,
    PermissionService,
    RoleService,
    CommentsService,
    JsonService,
    ActiveUserSocketGateway,
    SurveyService,
    SurveyTypeService,
    TrainingRequestService,
    TrainingService,
    TrainingTypeService,
    AssessmentService,
    CourseService,
    SessionService,
    ProgramService,
    StatesService,
    DataDraftService
  ],

  /**
   * API endpoint controllers
   */
  controllers: [
    OrganizationalUnitController,
    UserAuthController,
    AuditController,
    LocationController,
    OuTypeController,
    OuCategoryController,
    DataController,
    DataFieldController,
    FieldTypeController,
    DataTypeController,
    DataTemplateController,
    ContentUpdateController,
    KnowledgeLibraryController,
    KnowledgeLibraryCategoryController,
    FileController,
    PermissionController,
    RoleController,
    CommentsController,
    SurveyController,
    SurveyTypeController,
    TrainingRequestController,
    TrainingController,
    TrainingTypeController,
    CourseController,
    AssessmentController,
    SessionController,
    ProgramController,
    StatesController,
    DataDraftController
  ],
})
export class AppModule implements NestModule {
  /**
   *
   *
   * @param {MiddlewareConsumer} consumer
   * @memberof AppModule
   */
  configure(consumer: MiddlewareConsumer) {


    consumer.apply(LogMiddleware)
      .exclude("user/login")
      .forRoutes('*');

    consumer.apply(AuditMiddleware)
      .forRoutes('*')
  }
}
