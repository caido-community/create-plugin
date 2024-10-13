import { input, confirm, select } from '@inquirer/prompts';
import { ScaffoldConfig } from './types';


export const prompt = async (): Promise<ScaffoldConfig> => { 
  const packageName = await input({
    message: 'What is the name of your plugin package?',
    validate: (value) => {
      if (value.length === 0) {
        return 'Package name is required';
      }

      return true;
    },
  });

  const hasFrontend = await confirm({
    message: "Will your plugin package need to customize the user interface?",
  });

  let frontend: ScaffoldConfig['frontend'] | undefined = undefined;

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