import { input, confirm, select } from '@inquirer/prompts';

export const prompt = async () => { 
  const packageName = await input({
    message: 'What is the name of your plugin package?',
  });

  const hasFrontend = await confirm({
    message: "Will your plugin package need to customize the user interface?",
  });

  let frontendFramework: string | null = null;

  if (hasFrontend) {
    frontendFramework = await select({
      message: 'Choose a frontend framework:',
      choices: [
        { name: 'VueJS', value: 'vue', description: 'Build user interfaces with VueJS and Caido components' },
        { name: 'No Framework', value: 'none' },
      ],
    });
  }

  return {
    packageName,
    frontend: hasFrontend ? {
        framework: frontendFramework,
    } : undefined,
  }
}