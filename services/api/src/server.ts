import { app } from "./app";
import { env } from "./env";

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`Server running at http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
