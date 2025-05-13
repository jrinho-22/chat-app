import mongooseConnect from './database/connection';
import instance from './server/server';
import './server/socket';
import controllers from './controllers';

async function main() {
  await mongooseConnect()

  instance.generateApis(controllers)

  instance.httpServer.listen(3000, () => {
    console.log('Server listening on *:3000');
  });

}

main().catch(console.error);


