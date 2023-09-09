import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import { SentMessageInfo } from "nodemailer/lib/smtp-connection";
import { join } from "path";
import { MailLog } from "src/domain/mail-logs/dto/mail-log.dto";
import { MailLogRepository } from "src/domain/mail-logs/interfaces/mail-log-repository.interface";

/**
 * @export
 * @class MailService
 */
@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        @Inject('MailLogRepository') private mailLogRepository: MailLogRepository
    ) { }

    /**
     *
     *
     * @param {string} email
     * @param {ISendMailOptions['context']} context
     * @param {string} subject
     * @param {string} template
     * @return {*}  {Promise<SentMessageInfo>}
     * @memberof MailService
     */
    async sendMail({ email, context, subject, template }): Promise<void> {
        try {
            let details: ISendMailOptions = await this.mailerService.sendMail({
                to: email,
                subject: subject,
                template: join(__dirname, '..', '..', '..', 'templates', template),
                context: context,
            });
            let mailLog: MailLog = {
                status: 'SUCCESS',
                meta: { context, details }
            }
            this.mailLogRepository.create(mailLog);
        } catch (e) {
            let mailLog: MailLog = {
                status: 'ERROR',
                error:e,
                meta: {
                    email, context, subject, template
                }
            }
            this.mailLogRepository.create(mailLog);
            console.log(e);
        }
    }
}