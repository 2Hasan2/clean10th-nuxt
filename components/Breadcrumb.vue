<script setup>
const links_breadcrumb = ref([]);
const route = useRoute();

const generateBreadcrumbs = () => {
  const segments = route.path.split('/').filter((segment) => segment);
  let pathAccumulator = '';

  links_breadcrumb.value = segments.map((segment, index) => {
    pathAccumulator += `/${segment}`;

    const matchedRoute = route.matched.find((r) => r.path === pathAccumulator);

    return {
      label:
        matchedRoute?.meta?.breadcrumb?.label ||
        segment.charAt(0).toUpperCase() + segment.slice(1), 
      icon: matchedRoute?.meta?.breadcrumb?.icon || '',
      to: index !== segments.length - 1 ? pathAccumulator : undefined,
    };
  });

    links_breadcrumb.value.unshift({
        label: 'Home',
        icon: 'catppuccin:folder',
        to: '/',
    });
};

watch(
  () => route.path,
  () => generateBreadcrumbs(),
  { immediate: true }
);
</script>



<template>
  <UBreadcrumb :links="links_breadcrumb" />
</template>
