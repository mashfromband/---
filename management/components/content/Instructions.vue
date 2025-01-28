<template>
  <ContentDoc>
    <template v-slot="{ doc }">
      <UButton v-if="doc" @click="isOpen = true" icon="i-heroicons-information-circle" variant="link" size="xl" color="gray"/>
      <UModal v-model="isOpen">
          <UPageCard>
            <template #header>
              {{ doc.title }}
            </template>
            <UPageBody prose>
              <div class="scroll-area min-h-80">
                <ContentRenderer :value="doc" />
              </div>
            </UPageBody>
            <template #footer>
              <UButton @click="isOpen = false" label="CLOSE" />
            </template>
          </UPageCard>
      </UModal>
    </template>
    <template #not-found>
    </template>
    <template #empty>
    </template>
  </ContentDoc>
</template>
<script setup lang="ts">
const isOpen = ref(false)
</script>