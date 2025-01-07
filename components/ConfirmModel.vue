<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "are you sure?!"
  }
})

const emit = defineEmits(['delete', 'cancel'])

function onDelete() {
  emit('delete')
}

function onCancel() {
  emit('cancel')
}

</script>

<template>
  <UModal>
    <UCard>
        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Modal
                </h3>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="onCancel" />
            </div>
        </template>
        <div class="space-y-2">
            <p class="text-xl">{{ title }}</p>
            <div class="flex w-full gap-2">
                <UButton size="lg" @click="onDelete" color="red">
                    Delete
                </UButton>
                <UButton size="lg" @click="onCancel" class="flex w-1/2" block color="green">
                    Cancel
                </UButton>
            </div>
        </div>
    </UCard>
  </UModal>
</template>