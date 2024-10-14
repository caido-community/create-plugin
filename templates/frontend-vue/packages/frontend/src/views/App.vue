<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import { useSDK } from "@/plugins/sdk";

import manifest from "../../../../manifest.json" with { type: "json" };
import { ref } from "vue";

// Set the ID of the root element
// We use the manifest ID to ensure that the ID is unique per-plugin
// This is necessary to prevent styling conflicts between plugins
// The value here should be the same as the prefixWrap plugin in postcss.config.js
const rootId = `plugin--${manifest.id}`;

// Retrieve the SDK instance to interact with the backend
const sdk = useSDK();

const myVar = ref("Hello World");

// Call the backend to generate a random string
const onGenerateClick = async () => {
  const result = await sdk.backend.generateRandomString(10);
  myVar.value = result;
};
</script>

<template>
  <div :id="rootId" class="h-full flex justify-center items-center">
    <div class="flex flex-col gap-1">
      <Button label="Generate random string" @click="onGenerateClick" />
      <InputText :model-value="myVar" readonly />
    </div>
  </div>
</template>