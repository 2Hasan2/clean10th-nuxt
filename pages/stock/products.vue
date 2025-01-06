<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  breadcrumb: {
    label: 'Products',
    icon: 'catppuccin:taskfile',
  },
});

// Define columns and data
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

const people = [
  { id: 1, name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { id: 2, name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
  { id: 3, name: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member' },
  { id: 4, name: 'Whitney Francis', title: 'Copywriter', email: 'whitney.francis@example.com', role: 'Admin' },
  { id: 5, name: 'Leonard Krasner', title: 'Senior Designer', email: 'leonard.krasner@example.com', role: 'Owner' },
  { id: 6, name: 'Floyd Miles', title: 'Principal Designer', email: 'floyd.miles@example.com', role: 'Member' },
  { id: 7, name: 'Emily Selman', title: 'VP, User Experience', email: '', role: 'Admin' },
  { id: 8, name: 'Kristin Watson', title: 'VP, Human Resources', email: '', role: 'Member' },
  { id: 9, name: 'Emma Watson', title: 'Front-end Developer', email: '', role: 'Member' },
  { id: 10, name: 'John Doe', title: 'Designer', email: '', role: 'Admin' },
  { id: 11, name: 'Jane Doe', title: 'Director of Product', email: '', role: 'Member' },
  { id: 12, name: 'John Smith', title: 'Copywriter', email: '', role: 'Admin' },
  { id: 13, name: 'Jane Smith', title: 'Senior Designer', email: '', role: 'Owner' },
];

const q = ref('');
const page = ref(1);
const pageLimit = ref(5);

// Filter rows based on the search query
const filteredRows = computed(() => {
  if (!q.value) return people;

  return people.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const paginatedRows = computed(() => {
  return filteredRows.value.slice((page.value - 1) * pageLimit.value, page.value * pageLimit.value);
});
</script>

<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter people..." />
    </div>

    <UTable :rows="paginatedRows" :columns="columns"/>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination 
        v-model="page" 
        :page-count="pageLimit" 
        :total="filteredRows.length" />
    </div>
  </div>
</template>
