import { AbstractDocument } from '@libs/core/modules/database';
import { Prop, Schema } from '@nestjs/mongoose';
@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  static readonly collectionName = 'HubUsers';

  @Prop()
  email: string;

  @Prop()
  password: string;
}
