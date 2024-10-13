import { input, confirm, select } from '@inquirer/prompts';

type FrontendConfig = {
  framework: "vue" | "none";
}

export const prompt = async () => { 
  const packageName = await input({
    message: 'What is the name of your plugin package?',
  });

  const hasFrontend = await confirm({
    message: "Will your plugin package need to customize the user interface?",
  });

  let frontend: FrontendConfig | null = null;

  if (hasFrontend) {
    frontend = await select({
      message: 'Choose a frontend framework:',
      choices: [
        { name: 'VueJS', value: { framework: 'vue' }, description: 'Build user interfaces with VueJS and Caido components' },
        { name: 'No Framework', value: { framework: 'none' } },
      ],
    });
  }

  return {
    packageName,
    frontend
  }
}