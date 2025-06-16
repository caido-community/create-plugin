import { prompt } from "./prompt";
import { scaffold } from "./scaffold";

(async () => {
  const config = await prompt();
  await scaffold(config);
})();
