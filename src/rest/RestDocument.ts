import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
// import { API_SECURITY_SCHEME } from '../constants';

export class RestDocument {
  static async setup(app: NestExpressApplication): Promise<any> {
    const documentBuilder = new DocumentBuilder()
      .setTitle('API')
      // .setBasePath('/v1')
      .setDescription(
        `### REST

Routes is following REST standard (Richardson level 3)

<details><summary>Detailed specification</summary>
<p>

**List:**
  - \`GET /<resources>/\`
    - Get the list of **<resources>** as admin
  - \`GET /user/<user_id>/<resources>/\`
    - Get the list of **<resources>** for a given **<user_id>**
    - Output a **403** if logged user is not **<user_id>**

**Detail:**
  - \`GET /<resources>/<resource_id>\`
    - Get the detail for **<resources>** of id **<resource_id>**
    - Output a **404** if not found
  - \`GET /user/<user_id>/<resources>/<resource_id>\`
    - Get the list of **<resources>** for a given **user_id**
    - Output a **404** if not found
    - Output a **403** if:
      - Logged user is not **<user_id>**
      - The **<user_id>** have no access to **<resource_id>**

**Creation / Edition / Replacement / Suppression:**
  - \`<METHOD>\` is:
    - **POST** for creation
    - **PATCH** for update (one or more fields)
    - **PUT** for replacement (all fields, not used)
    - **DELETE** for suppression (all fields, not used)
  - \`<METHOD> /<resources>/<resource_id>\`
    - Create **<resources>** with id **<resource_id>** as admin
    - Output a **400** if **<resource_id>** conflicts with existing **<resources>**
  - \`<METHOD> /user/<user_id>/<resources>/<resource_id>\`
    - Create **<resources>** with id **<resource_id>** as a given **user_id**
    - Output a **409** if **<resource_id>** conflicts with existing **<resources>**
    - Output a **403** if:
      - Logged user is not **<user_id>**
      - The **<user_id>** have no access to **<resource_id>**
</p>
</details>`,
      );

    documentBuilder.setExternalDoc('For more information', 'http://swagger.io');

    // documentBuilder.addSecurity(API_SECURITY_SCHEME, {
    //   type: 'apiKey',
    //   name: 'Authorization',
    //   in: 'header',
    //   'x-amazon-apigateway-authtype': 'cognito_user_pools',
    //   'x-amazon-apigateway-authorizer': {
    //     type: 'cognito_user_pools',
    //     providerARNs: [
    //       // https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-enable-cognito-user-pool.html
    //       // > Cognitor > Copy ARN
    //       // 'arn:aws:cognito-idp:{region}:{account_id}:userpool/{user_pool_id}',
    //       'arn:aws:cognito-idp:ap-southeast-2:521377203912:userpool/ap-southeast-2_5Kxv0UOfm',
    //     ],
    //   },
    // } as SecuritySchemeObject);

    documentBuilder.addServer(
      'https://vxpy1r5xja.execute-api.ap-southeast-2.amazonaws.com/{basePath}',
      'Local server',
      {
        basePath: {
          default: 'sandbox',
          enum: ['sandbox', 'production'],
        },
      },
    );

    documentBuilder.addBearerAuth();

    if (process.env.API_VERSION) {
      documentBuilder.setVersion(process.env.API_VERSION);
    }

    const document = SwaggerModule.createDocument(app, documentBuilder.build());
    SwaggerModule.setup('documentation', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.info(
      `Documentation: http://localhost:${
        process.env.PORT || 3000
      }/documentation`,
    );
  }
}
