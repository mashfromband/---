// -*- coding: utf-8 -*-

import { SES, SendEmailCommandInput } from "@aws-sdk/client-ses";

export class CommonSimpleSendMailHandler {
    readonly toAddressList: string[];
    readonly fromAddress: string;
    readonly subject: string;
    readonly body: string;
    private replyToAddressList: string[] = [];

    constructor(toAddressList: string[], fromAddress: string, subject: string, body: string) {
        this.toAddressList = toAddressList;
        this.fromAddress = fromAddress;
        this.subject = subject;
        this.body = body;
    }

    public setReplayToAddresses(addresses: string[]) {
        this.replyToAddressList = addresses;
    }

    public getReplyToAddressList() {
        return this.replyToAddressList;
    }

    public async send() {
        const ses = new SES({
            region: process.env.RL_AWS_SES_REGION as string,
            credentials: {
                accessKeyId: process.env.RL_AWS_SES_ACCESS_KEY as string,
                secretAccessKey: process.env.RL_AWS_SES_ACCESS_KEY_SECRET as string,
            },
        });

        const options: SendEmailCommandInput = {
            Source: this.fromAddress,
            Destination: {
                ToAddresses: this.toAddressList,
            },
            Message: {
                Subject: {
                    Data: this.subject,
                },
                Body: {
                    Text: {
                        Data: this.body,
                    },
                },
            },
        };
        if (this.replyToAddressList.length > 0) {
            options.ReplyToAddresses = this.replyToAddressList;
        }

        return ses.sendEmail(options);
    }
}
