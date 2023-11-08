import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { dbConfig } from '@config/db.config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigType<typeof dbConfig>) => {
        return {
          uri: config.url,
          connectionFactory: (connection) => {
            return connection;
          },
        };
      },
      inject: [dbConfig.KEY],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(documents: any[]) {
    return MongooseModule.forFeature(
      documents.map((doc) => ({
        name: doc.collectionName,
        schema: SchemaFactory.createForClass(doc),
      })),
    );
  }
}
