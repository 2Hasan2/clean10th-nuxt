<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>

<template>
  <!-- layout -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- popups -->
  <UNotifications />
  <UModals />

  <!-- plugins -->
  <VitePwaManifest />
  <Analytics />
  <NuxtPath />
</template>
