import { prompt } from './prompt';

const main = async () => {
    const config = await prompt();

    if (config.frontend) {
        switch (config.frontend.framework) {
            case 'vue':
                // Copy the frontend-vue template
                break;
            case 'none':
                // Copy the frontend-vanilla template
                break;
        }
    } else {
        // Copy the no-frontend template
    }
}

// Execute the plugin creation function
main();