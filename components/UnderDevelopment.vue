<template>
    <div class="flex flex-col items-center justify-center text-center space-y-4">
        <UCard :ui="{ background: 'bg-white dark:bg-gray-800' }" class="p-6 max-w-md shadow-lg">
            <UIcon name="catppuccin:makefile" class="dark:text-gray-500 text-4xl mb-4" />
            <h2 class="text-xl font-bold dark:text-gray-500">Under Development</h2>
            <p class="dark:text-gray-600">
                This feature is currently under development. Stay tuned for updates!
            </p>
            <UButton class="mt-4" :to="{ name: 'index' }">
                Back to Home
            </UButton>
        </UCard>
    </div>
</template>
