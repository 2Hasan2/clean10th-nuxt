<script>
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <UModals />
  </div>
  <Analytics />
  <SpeedInsights />
</template>
