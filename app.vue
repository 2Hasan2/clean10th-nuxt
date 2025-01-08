<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
  <UModals />
  <Analytics />
  <SpeedInsights />
</template>
